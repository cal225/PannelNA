<?php
$occurence=0;
$data = "usage";
foreach (count_chars($data, 1) as $i => $val) {

$occurence=max($occurence,$val);
   echo "Il y a $val occurence(s) de \"" , chr($i) , "\" dans la phrase.\n";
}
 echo($occurence);
 
 /*
 mot, mot_majuscule, nb_lettres, lettres_uniques (Y/N), langue (FR,EN)
 
 */
 
 
?>