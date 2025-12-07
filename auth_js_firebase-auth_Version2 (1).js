// ES module for Firebase Auth (modular SDK)
// 替换下面 firebaseConfig 为你自己的配置（来自 Firebase 控制台 -> 项目设置 -> 添加 Web 应用）
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

let authInstance = null;

// TODO: 在此处填入你的 Firebase 配置（在 Firebase 控制台创建 Web 应用后会获得）
const firebaseConfig = {
  apiKey: "AIzaSyCAWBJmKLByAtltYR8pdqJT5tc9pkuMki4",
  authDomain: "debt-tracker-bde3c.firebaseapp.com",
  projectId: "debt-tracker-bde3c",
  storageBucket: "debt-tracker-bde3c.firebasestorage.app",
  messagingSenderId: "531615486230",
  appId: "1:531615486230:web:81210342c5a0107b000037"
};
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  // 可选：storageBucket, messagingSenderId, appId 等
};

export function initAuth() {
  if (authInstance) return;
  const app = initializeApp(firebaseConfig);
  authInstance = getAuth(app);

  // 在存在 DOM 元素时自动绑定事件处理（便于直接把本文件作为 <script type="module" src="..."> 引入）
  document.addEventListener('DOMContentLoaded', () => {
    // 注册
    const regBtn = document.getElementById('btn-register');
    if (regBtn) {
      regBtn.addEventListener('click', async () => {
        const email = document.getElementById('reg-email').value;
        const pass = document.getElementById('reg-pass').value;
        const msg = document.getElementById('reg-msg');
        msg.textContent = ''; msg.classList.remove('success');
        try {
          const userCredential = await createUserWithEmailAndPassword(authInstance, email, pass);
          // 发送邮箱验证（可选）
          await sendEmailVerification(userCredential.user);
          msg.classList.add('success');
          msg.textContent = '注册成功，已发送验证邮件，请查看邮箱。即将跳转...';
          setTimeout(() => { location.href = '/auth/dashboard.html'; }, 1200);
        } catch (e) {
          msg.classList.remove('success');
          msg.textContent = e.message;
        }
      });
    }

    // 登录
    const logBtn = document.getElementById('btn-login');
    if (logBtn) {
      logBtn.addEventListener('click', async () => {
        const email = document.getElementById('log-email').value;
        const pass = document.getElementById('log-pass').value;
        const msg = document.getElementById('log-msg');
        msg.textContent = '';
        try {
          await signInWithEmailAndPassword(authInstance, email, pass);
          location.href = '/auth/dashboard.html';
        } catch (e) {
          msg.textContent = e.message;
        }
      });
    }

    // 忘记密码
    const forgotBtn = document.getElementById('btn-forgot');
    if (forgotBtn) {
      forgotBtn.addEventListener('click', async () => {
        const email = document.getElementById('forgot-email').value;
        const msg = document.getElementById('forgot-msg');
        msg.textContent = '';
        try {
          await sendPasswordResetEmail(authInstance, email);
          msg.classList.add('success');
          msg.textContent = '已发送重置密码邮件，请检查邮箱。';
        } catch (e) {
          msg.classList.remove('success');
          msg.textContent = e.message;
        }
      });
    }
  });
}

// 提供 onAuthReady 接口给其它页面调用（如 dashboard.html）
export function onAuthReady(cb) {
  if (!authInstance) initAuth();
  onAuthStateChanged(authInstance, user => cb(user));
}

// 登出
export async function signOutUser() {
  if (!authInstance) initAuth();
  await signOut(authInstance);
}

// 若需要，可导出其它辅助函数
export function getAuthInstance() {
  if (!authInstance) initAuth();
  return authInstance;
}