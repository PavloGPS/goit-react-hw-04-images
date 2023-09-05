import React from 'react';
import PropTypes from 'prop-types';
import css from './Button.module.css';

const Button = ({ onLoadMoreBtnClick }) => {
  return (
    <button
      className={css.loadMoreBtn}
      type="button"
      onClick={onLoadMoreBtnClick}
    >
      Load more
    </button>
  );
};

Button.propTypes = {
  onLoadMoreBtnClick: PropTypes.func.isRequired,
};

export default Button;
