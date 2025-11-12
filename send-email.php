<?php
// Prevent direct access
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('HTTP/1.1 403 Forbidden');
    exit('Direct access not allowed');
}

// Set response headers
header('Content-Type: application/json');

// Load PHPMailer
require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Helper function to escape HTML to prevent injection
function escapeHtml($text) {
    if (empty($text)) return '';
    return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
}

// Get POST data
$firstName = isset($_POST['firstName']) ? trim($_POST['firstName']) : '';
$lastName = isset($_POST['lastName']) ? trim($_POST['lastName']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$address = isset($_POST['address']) ? trim($_POST['address']) : '';
$serviceType = isset($_POST['serviceType']) ? trim($_POST['serviceType']) : '';
$roomSize = isset($_POST['roomSize']) ? trim($_POST['roomSize']) : '';
$timeframe = isset($_POST['timeframe']) ? trim($_POST['timeframe']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Server-side validation
if (empty($firstName) || empty($lastName) || empty($email) || empty($serviceType)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Please fill in all required fields.'
    ]);
    exit;
}

// Email validation
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Please enter a valid email address.'
    ]);
    exit;
}

// Email configuration
$recipientEmail = 'info@localcarpetfitter.co.uk';
$fromEmail = 'noreply@localcarpetfitter.co.uk';
$fromName = 'Local Carpet Fitter Website';

// Service type names mapping
$serviceTypeNames = [
    'carpet' => 'Carpet Installation',
    'vinyl' => 'Vinyl Flooring',
    'laminate' => 'Laminate Flooring',
    'lvt' => 'Luxury Vinyl Tiles (LVT)',
    'consultation' => 'Free Consultation',
    'other' => 'Other'
];

// Timeframe names mapping
$timeframeNames = [
    'asap' => 'As soon as possible',
    '2weeks' => 'Within 2 weeks',
    'month' => 'Within a month',
    '3months' => 'Within 3 months',
    'planning' => 'Just planning ahead'
];

// Escape all user inputs
$safeFirstName = escapeHtml($firstName);
$safeLastName = escapeHtml($lastName);
$safeEmail = escapeHtml($email);
$safePhone = escapeHtml($phone);
$safeAddress = escapeHtml($address);
$safeRoomSize = escapeHtml($roomSize);
$safeMessage = escapeHtml($message);

$serviceName = isset($serviceTypeNames[$serviceType]) ? $serviceTypeNames[$serviceType] : escapeHtml($serviceType);
$timeframeName = isset($timeframeNames[$timeframe]) ? $timeframeNames[$timeframe] : escapeHtml($timeframe);

// Build email HTML content
$emailContent = '
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
    <div style="background-color: #dc2626; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">New Contact Form Submission</h1>
    </div>
    
    <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #1e293b; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">Customer Information</h2>
        
        <table style="width: 100%; margin: 20px 0;">
            <tr>
                <td style="padding: 10px 0; color: #64748b; font-weight: bold; width: 40%;">Name:</td>
                <td style="padding: 10px 0; color: #1e293b;">' . $safeFirstName . ' ' . $safeLastName . '</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Email:</td>
                <td style="padding: 10px 0; color: #1e293b;"><a href="mailto:' . $safeEmail . '" style="color: #dc2626; text-decoration: none;">' . $safeEmail . '</a></td>
            </tr>';

if (!empty($safePhone)) {
    $emailContent .= '
            <tr>
                <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Phone:</td>
                <td style="padding: 10px 0; color: #1e293b;"><a href="tel:' . $safePhone . '" style="color: #dc2626; text-decoration: none;">' . $safePhone . '</a></td>
            </tr>';
}

if (!empty($safeAddress)) {
    $emailContent .= '
            <tr>
                <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Address:</td>
                <td style="padding: 10px 0; color: #1e293b;">' . $safeAddress . '</td>
            </tr>';
}

$emailContent .= '
        </table>

        <h2 style="color: #1e293b; border-bottom: 2px solid #dc2626; padding-bottom: 10px; margin-top: 30px;">Service Details</h2>
        
        <table style="width: 100%; margin: 20px 0;">
            <tr>
                <td style="padding: 10px 0; color: #64748b; font-weight: bold; width: 40%;">Service Required:</td>
                <td style="padding: 10px 0; color: #1e293b;">' . $serviceName . '</td>
            </tr>';

if (!empty($safeRoomSize)) {
    $emailContent .= '
            <tr>
                <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Room Size:</td>
                <td style="padding: 10px 0; color: #1e293b;">' . $safeRoomSize . '</td>
            </tr>';
}

if (!empty($timeframe)) {
    $emailContent .= '
            <tr>
                <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Timeframe:</td>
                <td style="padding: 10px 0; color: #1e293b;">' . $timeframeName . '</td>
            </tr>';
}

$emailContent .= '
        </table>';

if (!empty($safeMessage)) {
    $emailContent .= '
        <h2 style="color: #1e293b; border-bottom: 2px solid #dc2626; padding-bottom: 10px; margin-top: 30px;">Additional Details</h2>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="color: #1e293b; line-height: 1.6; margin: 0;">' . nl2br($safeMessage) . '</p>
        </div>';
}

$emailContent .= '
        <div style="margin-top: 30px; padding: 20px; background-color: #f8fafc; border-radius: 6px; border-left: 4px solid #dc2626;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">
                <strong>Quick Actions:</strong><br>
                Reply to customer: <a href="mailto:' . $safeEmail . '" style="color: #dc2626; text-decoration: none;">' . $safeEmail . '</a><br>';

if (!empty($safePhone)) {
    $emailContent .= 'Call customer: <a href="tel:' . $safePhone . '" style="color: #dc2626; text-decoration: none;">' . $safePhone . '</a>';
}

$emailContent .= '
            </p>
        </div>
    </div>
    
    <div style="text-align: center; margin-top: 20px; color: #64748b; font-size: 12px;">
        <p>This email was sent from your Local Carpet Fitter website contact form</p>
    </div>
</div>';

// Plain text version
$textContent = "New Contact Form Submission\n\n";
$textContent .= "Customer Information:\n";
$textContent .= "- Name: $safeFirstName $safeLastName\n";
$textContent .= "- Email: $safeEmail\n";
if (!empty($safePhone)) $textContent .= "- Phone: $safePhone\n";
if (!empty($safeAddress)) $textContent .= "- Address: $safeAddress\n";
$textContent .= "\nService Details:\n";
$textContent .= "- Service Required: $serviceName\n";
if (!empty($safeRoomSize)) $textContent .= "- Room Size: $safeRoomSize\n";
if (!empty($timeframe)) $textContent .= "- Timeframe: $timeframeName\n";
if (!empty($safeMessage)) $textContent .= "\nAdditional Details:\n$safeMessage\n";
$textContent .= "\n---\n";
$textContent .= "Reply to: $safeEmail\n";
if (!empty($safePhone)) $textContent .= "Call: $safePhone\n";

// Email subject
$subject = "New Contact Form: $safeFirstName $safeLastName - $serviceName";

// Send email using PHPMailer
try {
    $mail = new PHPMailer(true);
    
    // Use Hostinger's mail server (works automatically on Hostinger)
    $mail->isMail(); // Use PHP's mail() function with proper headers
    
    // Email settings
    $mail->setFrom($fromEmail, $fromName);
    $mail->addAddress($recipientEmail);
    $mail->addReplyTo($email, "$firstName $lastName");
    
    // Content
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body = $emailContent;
    $mail->AltBody = $textContent;
    
    // Send email
    $mail->send();
    
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your message has been sent successfully. We\'ll get back to you soon!'
    ]);
    
} catch (Exception $e) {
    error_log("Email sending failed: " . $mail->ErrorInfo);
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send email. Please call us directly at 07412 703260.'
    ]);
}
?>
