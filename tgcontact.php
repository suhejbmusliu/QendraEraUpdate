<?php
// Show errors while debugging (REMOVE ON PRODUCTION IF YOU WANT)
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

// === CONFIGURE THESE ===
$botToken = '8524259159:AAHmSGZUjDAaXTF4hMwAzXflWEh62ELhPs0';
$chatId   = '1522497065'; // your user ID or group/channel ID

// Read JSON body from JS
$input = file_get_contents('php://input');
$data  = json_decode($input, true);

if ($data === null) {
    http_response_code(400);
    echo json_encode([
        'ok'    => false,
        'error' => 'Invalid JSON or empty body',
        'raw'   => $input
    ]);
    exit;
}

$text = $data['text'] ?? '';

if (!$text) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Missing text']);
    exit;
}

// Telegram API URL
$url = "https://api.telegram.org/bot{$botToken}/sendMessage";

$payload = [
    'chat_id' => $chatId,
    'text'    => $text,
];

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS     => json_encode($payload),
]);

$result = curl_exec($ch);
$error  = curl_error($ch);
curl_close($ch);

if ($error) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => $error]);
    exit;
}

echo json_encode(['ok' => true, 'result' => $result]);
