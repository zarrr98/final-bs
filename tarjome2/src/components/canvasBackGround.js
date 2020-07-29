import React from "react";

export default class CanvasBackGround extends React.Component {
  //   ctx = this.refs.canvas.getContext("2d");
  //   W = window.innerWidth;
  //   H = this.refs.canvas.offsetHeight;
  //   mf = 100;
  //   flakes = [];
  angle = 0;
  moveFlakes = () => {
    this.angle += 0.01;
    for (let i = 0; i < this.mf; i++) {
      let f = this.flakes[i];
      f.y += Math.pow(f.d, 2) + 1;
      f.x += Math.sin(this.angle) * 2;
      if (f.y > this.H) {
        this.flakes[i] = { x: Math.random() * this.W, y: 0, r: f.r, d: f.d };
      }
    }
  };
  drawFlakes = () => {
    this.ctx.clearRect(0, 0, this.W, this.H);
    this.ctx.fillStyle = "white";
    this.ctx.beginPath();

    for (let i = 0; i < this.mf; i++) {
      let f = this.flakes[i];
      this.ctx.moveTo(f.x, f.y);
      this.ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
    }
    this.ctx.font = "30px Comic Sans MS";
    this.ctx.textAlign = "center";
    this.ctx.fillText("Hello World", this.refs.canvas.width / 2, this.refs.canvas.height / 2);
    this.ctx.fill();
    this.moveFlakes();
  };
  updateCanvas = () => {
    this.ctx = this.refs.canvas.getContext("2d");
    this.W = window.innerWidth;
    this.H = this.refs.canvas.offsetHeight;

    this.mf = 100; //max of flakes
    this.flakes = [];
    for (let i = 0; i < this.mf; i++) {
      this.flakes.push({
        x: Math.random() * this.W,
        y: Math.random() * this.H,
        r: Math.random() * 3,
        d: Math.random()
      });
    }
  };
  componentDidMount = () => {
    this.updateCanvas();
    setInterval(this.drawFlakes, 25);
    // this.ctx.font = "30px Comic Sans MS";
    // this.ctx.fillStyle = "red";
    // this.ctx.textAlign = "center";
    // this.ctx.fillText("Hello World", this.refs.canvas.width / 2, this.refs.canvas.height / 2);
  };
  render() {
    return (
      <canvas ref="canvas" className="canvas-bg">
        {/* <h2 style={{color:'white',marginTop:'130px'}}>put a little love on me</h2> */}
      </canvas>
    );
  }
}
