<?php
// Log errors instead of showing them to visitors.
error_reporting(E_ALL);
ini_set('display_errors', 0);
header('Content-Type: application/json');

// Bot token and chat id live in tg-config.php, which is not committed.
// On a new server: copy tg-config.example.php to tg-config.php and fill it in.
$configFile = __DIR__ . '/tg-config.php';
if (!is_file($configFile)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Contact form is not configured']);
    exit;
}
$config   = require $configFile;
$botToken = $config['bot_token'];
$chatId   = $config['chat_id'];

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
