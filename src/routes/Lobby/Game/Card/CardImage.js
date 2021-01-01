import React from 'react';
import PropTypes from 'prop-types';

const CardImage = ({name, ...rest/*size = 16, fill = "#000"*/}) => {
    return <img alt={name} {...rest}/>;
};

CardImage.propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
}

export default CardImage;
