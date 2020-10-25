import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = props => <p className="error_message">{props.message}</p>;

export default ErrorMessage;
