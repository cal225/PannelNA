SELECT 
    v.date_debut AS ETD,
    v.terrain_to AS DEST,
    '-' AS EQUIPE,
    a.immat_avion AS AERONEF,
    r.id_lecon AS VOL,
    '-' AS DISPONIBILITE
FROM app_vols v
LEFT JOIN app_resa r ON v.id_resa = r.id_resa
LEFT JOIN app_lov_avions a ON v.id_avion = a.id_avion
LEFT JOIN app_lov_type_vol t ON r.id_type = t.id_type_vol
ORDER BY v.date_debut DESC
LIMIT 30;


-- SELECT * FROM `app_resa` 
-- id_resa | id_client | id_client | date_debut | id_type 

-- SELECT * FROM `app_client`
-- id_client | nom_client | prenom_client |

-- SELECT * FROM `app_lov_avions` 
-- id_avion | immat_avion | seats

-- SELECT * FROM `app_lov_type_vol` 
-- id_type_vol | desc_type_vol 

-- SELECT * FROM `app_vols`
-- id_vol | id_lecon | id_avion | date_debut | terrain_from | terrain_to | id_pilote | id_resa (there can be multiple reservations with the same id) 

