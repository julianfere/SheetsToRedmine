import { useState } from "react";
import "./index.scss";

type TokenFormProps = {
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

export const TokenForm = ({ handler, placeholder, title }: TokenFormProps) => {
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [token, setToken] = useState("");

  return (
    <section className="token-container">
      <h3>{title}</h3>
      <input
        type="text"
        className="token-input"
        value={token}
        placeholder={placeholder}
        onChange={(e) => setToken(e.target.value)}
        readOnly={isReadOnly}
      />
      <button
        className="btn"
        onClick={() => handleSave(token, handler, setIsReadOnly)}
      >
        {isReadOnly ? "Edit" : "Save"}
      </button>
    </section>
  );
};
