import React, { createClass } from 'react';
import { render } from 'react-dom';
import electron, { ipcRenderer as ipc }  from 'electron';

var audio = new Audio('./chime_bell_ding.wav');

var timers = {};
var padLeft = (word, length, pad) => {
    const w = String(word);
    const diff = length - w.length;
    return diff === 0 ?
        w :
        `${Array.from({ length: diff }).map(_ => pad)}${w}`
}

var mainTimeout = (function () {
    return (fn, wait) => {
        var r = Math.random();
        var listener = function (e, id) {
            delete timers[r];
            fn();
        }
        timers[r] = true;
        ipc.send('timerBegin', r, wait);
        ipc.on('timerEnd', listener);
        return () => {
            ipc.removeListener('timerEnd', listener);
            ipc.send('timerCancel', r);
        }
    };
}());

const timerStyle = {
    color: 'orangered',
    fontSize: 60,
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontFamily: 'sans-serif',
    fontWeight: 200,
    lineHeight: '120px'
};

const Timer = createClass({
    getInitialState() {
        return {
            elapsed: 0,
            start: Date.now()
        }
    },

    componentWillMount() {
        this.cancel = mainTimeout(this.props.done, this.props.length);
        this.frame = requestAnimationFrame(this.tick);
    },

    tick() {
        cancelAnimationFrame(this.frame);
        this.setState({ frame: Math.random() });
        this.frame = requestAnimationFrame(this.tick);
    },

    componentWillUnmount() {
        cancelAnimationFrame(this.frame);
        this.cancel();
    },

    render() {
        var tot = this.props.length - (Date.now() - this.state.start) / 1000;
        var mins = Math.floor(tot / 60);
        var secs = Math.floor(tot % 60);
        return <div style={timerStyle}>{padLeft(mins, 2, 0)}:{padLeft(secs, 2, 0)}</div>
    }
});

const timerButton = {
    background: 'orangered',
    width: 55,
    height: 55,
    boxSizing: 'border-box',
    lineHeight: 0.9,
    paddingTop: 11,
    color: '#fff',
    position: 'relative',
    borderRadius: 500,
    border: 0,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
    outline: 'none !important',
    display: 'block'
};

const background = { 
    margin: '15 50 0',
    borderRadius: 5,
    height: 120,
    background: '#fff',
    position: 'relative',
    boxShadow: '0 5px 25px rgba(0,0,0,0.05)',
    '-webkit-filter': 'blur(0)'
};

const buttons = {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 120,
    padding: '0 10px',
    cursor: 'pointer',
    fontFamily: 'sans-serif'
};

const Arrow = ({ size = 15 }) => <div style={{
    position: 'absolute',
    left: `calc(50% - ${size / 2}px)`,
    top: (size / 2) * -1,
    background: '#fff',
    transform: 'rotate(45deg)',
    display: 'block',
    height: size,
    width: size
}}/>;

const App = createClass({
    displayName: 'App',

    getInitialState() {
        return { timer: null }
    },

    startTimer(timer) {
        this.setState({
            timer
        });
    },

    endTimer() {
        this.props.pomodoroFinished();
        audio.play();
        this.setState({
            timer: null
        })
    },

    cancelTimer() {
        this.setState({
            timer: null
        })
    },

    render() {
        return (<div style={background}>
            <Arrow />
            {this.state.timer ? 
                <div>
                    <Timer length={this.state.timer} done={this.endTimer}/>
                    <div onClick={this.cancelTimer} style={{ position: 'absolute', top: 10, left: 10, background: 'orangered', color: '#fff', width: 15, height: 15, borderRadius: '100px', fontFamily: 'sans-serif', fontWeight: 'bold', textAlign: 'center', lineHeight: '15px', cursor: 'pointer', fontSize: 8 }}>x</div>
                </div> 
                    : 
                <div style={buttons}>
                    <div style={timerButton} onClick={() => this.startTimer(5)}>5<br />secs</div>
                    <div style={timerButton} onClick={() => this.startTimer(5 * 60)}>5<br />mins</div>
                    <div style={timerButton} onClick={() => this.startTimer(15 * 60)}>15 mins</div>
                    <div style={timerButton} onClick={() => this.startTimer(25 * 60)}>25 mins</div>
                </div>}
            </div>);
    }
});

const root = document.querySelector('.root');
render(<App pomodoroFinished={() => {
    ipc.send('pomodoroComplete');
    const pomodoros = localStorage.getItem('pomodoros');
    localStorage.setItem('pomodoros', pomodoros + 1);
}}/>, root);

if (module.hot) {
    module.hot.accept()
}
