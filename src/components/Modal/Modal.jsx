import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './Modal.module.css';

class Modal extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    lgImage: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = event => {
    if (event.code === 'Escape') {
      this.props.closeModal();
    }
  };

  handleBackdropClick = event => {
    if (event.currentTarget === event.target) {
      this.props.closeModal();
    }
  };

  render() {
    const { lgImage, tags } = this.props;
    return (
      <div className={style.Overlay} onClick={this.handleBackdropClick}>
        <div className={style.Modal}>
          <img src={lgImage} alt={tags} />
        </div>
      </div>
    );
  }
}

export default Modal;
