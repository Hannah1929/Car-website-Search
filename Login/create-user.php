<?php
header('Content-Type: application/json');

// Eingehende JSON-Daten lesen
$input = file_get_contents('php://input');
var_dump($input); // Debugging: gibt den Inhalt der Anfrage aus
$data = json_decode($input, true);

// Prüfen ob Daten da sind
if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Ungültige Eingabedaten.']);
    exit;
}

// Datei erstellen, wenn nicht vorhanden
$file = 'MOCK_DATA_2.json';
if (!file_exists($file)) {
    file_put_contents($file, '[]');
}

// Bestehende User laden
$users = json_decode(file_get_contents($file), true);
if (!is_array($users)) {
    $users = [];
}

// E-Mail prüfen
foreach ($users as $user) {
    if ($user['email'] === $data['email']) {
        echo json_encode(['success' => false, 'message' => 'E-Mail bereits registriert.']);
        exit;
    }
}

// Neuen Benutzer erstellen
$newUser = [
    'id' => count($users) + 1,
    'first_name' => $data['first_name'],
    'last_name' => $data['last_name'],
    'email' => $data['email'],
    'password' => $data['password'],
    'address' => '',
    'favorite_cars' => []
];

// Benutzer hinzufügen und speichern
$users[] = $newUser;
file_put_contents($file, json_encode($users, JSON_PRETTY_PRINT));

// Erfolgreiche Antwort
echo json_encode(['success' => true]);
?>
