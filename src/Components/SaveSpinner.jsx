const SaveSpinner = ({ message }) => {
  return (
    <div className="SaveSpinner-wrapper">
      <div className="SaveSpinner" />
      <span className="SaveSpinner-message">{message}</span>
    </div>
  );
};

export default SaveSpinner;