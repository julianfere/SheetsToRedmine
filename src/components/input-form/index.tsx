import { useState } from "react";
import "./index.scss";

type InputFormProps = {
  title: string;
  placeholder: string;
  handler: (token: string) => void;
};

const handleSave = (
  token: string,
  handler: (token: string) => void,
  setReadonly: (callback: (old: boolean) => boolean) => void
) => {
  handler(token);
  setReadonly((old) => !old);
};

export const InputForm = ({ handler, placeholder, title }: InputFormProps) => {
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [token, setToken] = useState("");

  return (
    <section className="token-container">
      <p className="col1">{title}</p>
      <input
        type="text"
        className="token-input col2"
        value={token}
        placeholder={placeholder}
        onChange={(e) => setToken(e.target.value)}
        readOnly={isReadOnly}
      />
      <button
        className="btn col3"
        onClick={() => handleSave(token, handler, setIsReadOnly)}
      >
        {isReadOnly ? "Edit" : "Save"}
      </button>
    </section>
  );
};
