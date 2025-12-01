<?php
// 日本語設定
mb_language("Japanese");
mb_internal_encoding("UTF-8");

// JSONデータを受け取る
$json = file_get_contents("php://input");
$data = json_decode($json, true);

// レスポンス用配列
$response = array("success" => false, "message" => "");

// POSTメソッドかつデータがある場合のみ処理
if ($_SERVER["REQUEST_METHOD"] == "POST" && !empty($data)) {
    
    // 入力データの取得とサニタイズ
    $company = htmlspecialchars($data['company'] ?? '', ENT_QUOTES, 'UTF-8');
    $name = htmlspecialchars($data['name'] ?? '', ENT_QUOTES, 'UTF-8');
    $email = htmlspecialchars($data['email'] ?? '', ENT_QUOTES, 'UTF-8');
    $message = htmlspecialchars($data['message'] ?? '', ENT_QUOTES, 'UTF-8');
    $website = $data['website'] ?? ''; // ハニーポット

    // ハニーポットチェック（ボット対策）
    if (!empty($website)) {
        // ボットとみなして成功を装って終了
        $response["success"] = true;
        $response["message"] = "送信しました";
        echo json_encode($response);
        exit;
    }

    // 必須項目のチェック
    if (empty($company) || empty($name) || empty($email) || empty($message)) {
        $response["message"] = "必須項目が入力されていません。";
        echo json_encode($response);
        exit;
    }

    // 送信先メールアドレス
    $to = "designroommaster@gmail.com";
    
    // 件名
    $subject = "【DesignRoom】お問い合わせがありました";
    
    // 本文
    $body = "Webサイトからのお問い合わせがありました。\n\n";
    $body .= "【会社名】\n" . $company . "\n\n";
    $body .= "【お名前】\n" . $name . "\n\n";
    $body .= "【メールアドレス】\n" . $email . "\n\n";
    $body .= "【お問い合わせ内容】\n" . $message . "\n\n";
    
    // 送信元（From）
    // エックスサーバー等の場合、Fromはサーバーのドメインのメアドにするのが確実ですが、
    // ここでは返信しやすいようにユーザーのメアドをFromに設定します。
    // もし届かない場合は、Fromをサーバーのメアドに変更し、Reply-Toを設定してください。
    $headers = "From: " . $email . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";

    // メール送信実行
    if (mb_send_mail($to, $subject, $body, $headers)) {
        $response["success"] = true;
        $response["message"] = "お問い合わせありがとうございます。担当者よりご連絡いたします。";
        
        // --- 自動返信メール（お客様用） ---
        $auto_reply_subject = "【DesignRoom】お問い合わせありがとうございます";
        $auto_reply_body = $name . " 様\n\n";
        $auto_reply_body .= "お問い合わせありがとうございます。\n";
        $auto_reply_body .= "以下の内容で受け付けました。\n\n";
        $auto_reply_body .= "--------------------------------------------------\n";
        $auto_reply_body .= "【会社名】 " . $company . "\n";
        $auto_reply_body .= "【お名前】 " . $name . "\n";
        $auto_reply_body .= "【お問い合わせ内容】\n" . $message . "\n";
        $auto_reply_body .= "--------------------------------------------------\n\n";
        $auto_reply_body .= "担当者より順次ご連絡させていただきます。\n";
        $auto_reply_body .= "今しばらくお待ちください。\n\n";
        $auto_reply_body .= "DesignRoom";
        
        // 自動返信のFromは管理者のアドレス
        $auto_reply_headers = "From: designroommaster@gmail.com\r\n";
        
        // 自動返信送信
        mb_send_mail($email, $auto_reply_subject, $auto_reply_body, $auto_reply_headers);
        
    } else {
        $response["message"] = "メール送信に失敗しました。サーバーの設定をご確認ください。";
    }

} else {
    $response["message"] = "不正なリクエストです。";
}

// JSON形式で出力
header('Content-Type: application/json; charset=utf-8');
echo json_encode($response);
?>
