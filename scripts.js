document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            const users = JSON.parse(localStorage.getItem("users")) || [];
            const user = users.find(user => user.email === email && user.password === password);

            if (user) {
                alert("로그인 성공!");
                // 로그인 성공 후 리다이렉션 처리 (예: 홈 페이지로 이동)
                window.location.href = "index.html";
            } else {
                alert("이메일 또는 비밀번호가 잘못되었습니다.");
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm-password").value;

            if (password !== confirmPassword) {
                alert("비밀번호가 일치하지 않습니다.");
                return;
            }

            const users = JSON.parse(localStorage.getItem("users")) || [];
            if (users.find(user => user.email === email)) {
                alert("이미 등록된 이메일입니다.");
                return;
            }

            users.push({ email, password });
            localStorage.setItem("users", JSON.stringify(users));

            alert("회원가입 성공!");
            // 회원가입 후 로그인 페이지로 리다이렉션 처리
            window.location.href = "login.html";
        });
    }
});