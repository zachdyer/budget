<!DOCTYPE html>
<?php
	$loggedIn = false;
	$username = $_POST["username"];
	$password = $_POST["password"];
	if($username && $password){
		$loggedIn = true;
	}
?>
<html>
	<head>
		<title>Budget</title>
		<meta charset="UTF-8">
		<meta name="robots" content="noindex" />
		<link rel="stylesheet" href="style.css" type="text/css">
	</head>
	<body>
		<header>
			<h1>Budget</h1>
			<canvas id="progressBar"></canvas>
		</header>
		
		<?php if($loggedIn): ?>
		<section id="bills">
			<h2 id="billHeader">September Bills</h2>
			<h2 id="days-covered"></h2>
			<h2 id="min-balance"></h2>
			<h2 id="current-balance"></h2>
			<form id="budgetForm">
				<ul id="list"></ul>
			</form>
		</section>
		
		<section id="sign">
			<p id="nextBill"></p>
		</section>
		<script src="main.js"></script>
		<?php else: ?>
			<form id="login" action="index.php" method="post">
				<div id="username">
					<label for="username">Username: </label>
					<input name="username" type="text">
				</div>
				<div id="password">
					<label for="password">Password: </label>
					<input name="password" type="password">
				</div>
				<div id="submit">
					<button>Submit</button>
				</div>
			</form>
			<script type="text/javascript" src="login.js"></script>
		<?php endif; ?>
		<p>
		    <a href="http://jigsaw.w3.org/css-validator/check/referer" style="margin-left:20px;">
		        <img style="border:0;width:88px;height:31px"
		            src="http://jigsaw.w3.org/css-validator/images/vcss"
		            alt="Valid CSS!" />
		    </a>
		</p>

		
	</body>	
</html>
