import React, { Component } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './Slider.scss';
import slider from '../../data/main-slider.json';

class Slider extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSelect = this.handleSelect.bind(this);

    this.state = {
      index: 0,
      direction: null,
    };
  }

  handleSelect(selectedIndex, e) {
    this.setState({
      index: selectedIndex,
      direction: e && e.direction,
    });
  }

  render() {
    const { index, direction } = this.state;

    const carouselItems = slider.map((e, index)=>{
      const img = require(`../../assets/img/slider/${e.img}`);
      const divStyle = {
        "background": `url(${img}) no-repeat center center fixed`
      };
      return (
        <Carousel.Item className="carousel-slider-item" style={divStyle} alt={e.title} key={index}>
          <div className="container">
            <Carousel.Caption>
              <h1>{e.title}</h1>
              <p>{e.info}</p>
            </Carousel.Caption>
          </div>
        </Carousel.Item>
      );
    });

    return (
      <Carousel activeIndex={index} direction={direction} onSelect={this.handleSelect} className="carousel-slider">
        {carouselItems}
      </Carousel>
    );
  }
}

export default Slider;
