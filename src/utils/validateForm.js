const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^[a-zA-Z0-9]*$/;

export const validateSignupForm = (form) => {
  const checks = [
    {
      field: 'nickName',
      valid: !!form.nickName.trim(),
      message: '닉네임을 입력해주세요.',
    },
    {
      field: 'nickName',
      valid: form.nickName.length >= 1 && form.nickName.length <= 20,
      message: '닉네임은 1자 이상 20자 이하로 입력해주세요.',
    },
    {
      field: 'userId',
      valid: !!form.userId.trim(),
      message: '아이디를 입력해주세요.',
    },
    {
      field: 'userId',
      valid: form.userId.length >= 1 && form.userId.length <= 20,
      message: '아이디는 1자 이상 20자 이하로 입력해주세요.',
    },
    {
      field: 'password1',
      valid: !!form.password1.trim(),
      message: '비밀번호를 입력해주세요.',
    },
    {
      field: 'password1',
      valid: form.password1.length >= 8 && form.password1.length <= 20,
      message: '비밀번호는 8자 이상 20자 이하로 입력해주세요.',
    },
    {
      field: 'password1',
      valid: passwordRegex.test(form.password1),
      message: '영어 또는 숫자만 사용이 가능합니다.',
    },
    {
      field: 'password2',
      valid: form.password1 === form.password2,
      message: '비밀번호가 일치하지 않습니다.',
    },
    {
      field: 'email',
      valid: !!form.email.trim(),
      message: '이메일을 입력해주세요.',
    },
    {
      field: 'email',
      valid: form.email.length >= 6 && form.email.length <= 50,
      message: '이메일은 6자 이상 50자 이하로 입력해주세요.',
    },
    {
      field: 'email',
      valid: emailRegex.test(form.email),
      message: '이메일 형식이 아닙니다.',
    },
  ];

  for (const check of checks) {
    if (!check.valid) return { field: check.field, message: check.message };
  }

  return null;
};


export const validateLoginForm = (form) => {
  const checks = [
    {
      field: "email",
      valid: !!form.email.trim(),
      message: "이메일을 입력해주세요.",
    },
    {
      field: "email",
      valid: emailRegex.test(form.email),
      message: "이메일 형식이 아닙니다.",
    },
    {
      field: "password",
      valid: !!form.password.trim(),
      message: "비밀번호를 입력해주세요.",
    },
    {
      field: 'password',
      valid: form.password.length >= 8 && form.password.length <= 20,
      message: '비밀번호는 8자 이상 20자 이하로 입력해주세요.',
    },
  ];

  for (const check of checks) {
    if (!check.valid) return { field: check.field, message: check.message };
  }

  return null;
};
