// 年齢を計算する関数
function updateAge() {
    // 生年
    const birthYear = 1999;
    const birthMonth = 1;  // 誕生日月（12月）
    const birthDay = 29;     // 誕生日日（1日）

    // 現在の日付を取得
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 1月 = 1, 2月 = 2, ..., 12月 = 12
    const currentDay = currentDate.getDate();

    // 現在の年齢を計算
    let age = currentYear - birthYear;

    // 現在の月と日が誕生日を過ぎていない場合は年齢を1歳引く
    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
        age--;
    }

    // 年齢をHTMLに表示
    document.getElementById("age").textContent = age;
}

// ページが読み込まれたら年齢を更新
window.onload = updateAge;