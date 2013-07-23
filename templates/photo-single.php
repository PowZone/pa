<?php 
    $_GET['template'] = 'photography';
    include("includes/header.php"); 
?>
    <div class="photo viewer">
        <div class="details">
            <header>
                <h3>Photo Gallery</h3>
                <time datetime="2013">2013</time>
            </header>
            <p class="summary">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus rhoncus mauris vel molestie cursus. Suspendisse vehicula tortor metus, non iaculis.</p> <!-- .summary -->
        </div> <!-- .details -->
        <div class="container" id="showcaseContainer">

            <?php
                $_GET['template'] = 'single-photo';
                include("includes/image-showcase.php"); ?>

        </div> <!-- .container -->
    </div> <!-- .viewer -->
<?php include("includes/footer.php"); ?>
