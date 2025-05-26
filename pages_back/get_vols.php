<?php
$servername = "";
$username = "";
$password = "";
$dbname = "";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "
    SELECT 
        v.date_debut AS ETD,
        v.terrain_to AS DEST,
        a.immat_avion AS Aéronef,
        t.desc_type_vol AS Vol
    FROM app_vols v
    LEFT JOIN app_lov_avions a ON v.id_avion = a.id_avion
    LEFT JOIN app_resa r ON v.id_resa = r.id_resa
    LEFT JOIN app_lov_type_vol t ON r.id_type = t.id_type_vol
    WHERE v.terrain_from = 'LFSP'
    AND v.date_debut >= NOW()
    ORDER BY v.date_debut ASC
";

$result = $conn->query($sql);
$output = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $output[] = [
            "ETD" => $row["ETD"],
            "DEST" => $row["DEST"],
            "Aéronef" => $row["Aéronef"],
            "Vol" => $row["Vol"]
        ];
    }
}

// Prepare output directory
$dir = "../tmp/pro_vol/";
if (!is_dir($dir)) {
    mkdir($dir, 0755, true);
}

$filename = "get_vols_result_" . date("Ymd_His") . ".json";
file_put_contents($dir . $filename, json_encode($output, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo "✅ Data exported to: " . $dir . $filename;

$conn->close();
