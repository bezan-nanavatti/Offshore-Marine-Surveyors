
<?php 
if(isset($_POST['submit'])){
    $to = "info@offshoremarinesurveyors.com"; // this is your Email address
    $from = $_POST['email']; // this is the sender's Email address
    $name = $_POST['name'];
    $phone = $_POST['phone'];
    $subject = "Constellation Website";
    $message = $name . "  his phone No. " . $phone . " wrote the following:" . "\n\n" . $_POST['message'];
    $headers = "From:" . $from;
    mail($to,$subject,$message,$headers);
    
    // echo "Mail Sent. Thank you " . $name . ", we will contact you shortly.";
    // You can also use header('Location: thank_you.php'); to redirect to another page.
    // You cannot use header and echo together. It's one or the other.
    }
    
   header('Location: https://offshoremarinesurveyors.com/contact.html');
?>