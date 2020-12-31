import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';

const CardImage= ({name, ...rest/*size = 16, fill = "#000"*/}) => {
    const [src, setSrc] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const importIcon = async () => {
            try {
                const {default: namedImport} = await import(`./../../../../assets/cards/${name}.svg`);
                console.log(namedImport)

                setSrc(namedImport);
            } catch (err) {
                throw err;
            } finally {
                setLoading(false);
            }
        };
        importIcon();
    }, [name]);

    if (!loading && src !== null) {
        return <img src={src} alt={name} {...rest}/>;
    }

    return null;
};

CardImage.propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
}

export default CardImage;
