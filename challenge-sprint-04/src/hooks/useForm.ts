import { useEffect, useState } from "react";


type Rules<T> = Partial<Record<keyof T, (value: T[keyof T]) => string | null>>;

export function useForm<T extends Record<string, unknown>>(
  initial: T,
  rules: Rules<T>
) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  // Revalida campos sempre que valores mudarem
  useEffect(() => {
    if (!submitted) return;
    const e: Partial<Record<keyof T, string>> = {};
    for (const key in rules) {
      const fn = rules[key];
      if (fn) {
        const msg = fn(values[key]);
        if (msg) e[key] = msg;
      }
    }
    setErrors(e);
  }, [values, rules, submitted]);

  // Função para vincular um input a este hook
  function register<K extends keyof T>(name: K) {
    return {
      name: name as string,
      value: values[name] as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setValues((v) => ({ ...v, [name]: e.target.value })),
    };
  }

  // Valida tudo e executa o callback se não houver erros
  function handleSubmit(cb: (vals: T) => void) {
    return (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);

      const e2: Partial<Record<keyof T, string>> = {};
      for (const key in rules) {
        const fn = rules[key];
        if (fn) {
          const msg = fn(values[key]);
          if (msg) e2[key] = msg;
        }
      }
      setErrors(e2);

      if (Object.keys(e2).length === 0) {
        cb(values);
      }
    };
  }

  // 🔑 Retorna tudo que o formulário precisa
  return { values, errors, setValues, register, handleSubmit };
}
