<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Making sure, that request is of type POST:
if ($_SERVER['REQUEST_METHOD'] == 'POST') { // request from type POST?
    $data = json_decode(file_get_contents('php://input'), true);//Receive JSON

    // Debugging
    if ($data) {
        var_dump($data); // Show data in answer
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
        exit;
    }

    if (isset($data['userId']) && isset($data['carId'])) {
        $userId = $data['userId'];
        $carId = $data['carId'];

        $filePath = 'Car-website-Search/Login/MOCK_DATA-2.json'; // load MOCK User Data
        $jsonData = file_get_contents($filePath);
        $users = json_decode($jsonData, true);

        // Finde den Benutzer mit der angegebenen userId
        foreach ($users as &$user) { // Find userID in UserData
            if ($user['id'] == $userId) {
                if (!in_array($carId, $user['favorite_cars'])) { //Insert carID into favorite_cars array
                    $user['favorite_cars'][] = $carId;
                }
                file_put_contents($filePath, json_encode($users, JSON_PRETTY_PRINT)); //save updated data in JSON
                echo json_encode(['success' => true]); //send positive answer
                exit;
            }
        }

        echo json_encode(['success' => false, 'message' => 'User not found']); //negative answer, if user not found
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid data']); //negative answer, if parameters are missing
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
