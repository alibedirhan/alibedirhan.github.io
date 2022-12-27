<?php
$hata = false;
$gonder = false;
//Gönderme işleminin mevcut olup olmadığını kontrol ediyoruz.
if( isset($_POST["islem"]) && $_POST["islem"]=="gonder" ) {
	
	//Formdan gelen verilerin eksiksiz olup olmadığını kontrol ediyoruz.
	if( !empty($_POST["İsim Soyisim"]) && !empty($_POST["Email adresi"]) && !empty($_POST["Konu"]) && !empty($_POST["Mesaj"]) ) {
		
		//PHPMailer
		include_once('phpmailer/class.phpmailer.php');
		
		//Ayarlar (Bu ayarlar için gerekli bilgiler kullandığınız sunucuya göre değişebilir.)
		$mail = new PHPMailer();
		$mail->isSMTP();  //SMTP Aktif
		//$mail->SMTPDebug = 1; //Hata Gösterimi Aktif
		//$mail->SMTPSecure = 'tls';  //TLS Aktif
		$mail->SMTPAuth   = true;  //SMTP Kimlik Doğrulaması Aktif
		$mail->Host       = 'host@example.com';  //SMTP Host
		$mail->Username   = 'mail@example.com';  //SMTP Kullanıcı Adınız
		$mail->Password   = 'password';	 //SMTP Şifreniz
		$mail->Port       = 587;  //SMTP Portu
		$mail->setFrom('mail@example.com', 'Gönderen Adı');  //Mailin Kimden Gönderildiği
		$mail->addAddress('alibedirhan@protonmail.com', 'Ali Bedirhan DURSUN');	//Mailin Gönderileceği Adres (Buraya formdan gelen mesajın gönderileceği mail adresini giriniz.)
		
		//HTML Aktif
		$mail->isHTML(true);
		$mail->CharSet ="utf-8";
		//Mail Başlığı
		$mail->Subject = 'İletişim Formu Mesajı';
		//Mail İçeriği
		$mail->Body    = '<p><strong>Gönderen:</strong> ' . $_POST["adsoyad"] . ' - ' . $_POST["email"] . '</p>'.
		'<p><strong>Konu:</strong> ' . $_POST["konu"] . '</p>'.
		'<p><strong>Mesaj:</strong> ' . $_POST["mesaj"] . '</p>';

		//Gönder
		if ( $mail->send() ) {
			$gonder = true;
		} else {
			$hata = true;
			$hata_mesaj = "Mesaj gönderilirken bir hata oluştu: ".$mail->ErrorInfo;
		}
	} else {
		$hata = true;
		$hata_mesaj = "Lütfen tüm alanları doldurun.";
	}
	
}
?>