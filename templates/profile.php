<?php 
    $_GET['template'] = 'profile';
    include("includes/header.php"); 
?>

    <h2 class="visuallyhidden">Profile Home</h2>

    <div class="profile viewer">
        <div class="details">
            <ul class="showcase-links">
                <li>
                <?php
                    $q = $_SERVER['QUERY_STRING'];
                    if ( $q == null ) { 
                ?>
                    <a href="#" id="mockBio" class="active">
                <?php } else { ?>
                    <a href="#" id="mockBio">
                <?php } ?>  Bio/CV</a>
                </li>
                <li>
                <?php if ( $q == 'mockPressList' ) { ?>
                    <a href="#" id="mockPressList" class="active">
                <?php } else { ?>
                    <a href="#" id="mockPressList">
                <?php } ?>  Press</a>
                </li>
                <li><a href="#" id="mockAwardList">Selected Awards</a></li>
                <li><a href="#" id="mockImageGallery">Photos of PA</a></li>
                <li>
                <?php if ( $q == 'mockArticleList' ) { ?>
                    <a href="#" id="mockArticleList" class="active">
                <?php } else { ?>
                    <a href="#" id="mockArticleList">
                <?php } ?>  Articles by PA</a>
                </li>
                <li><a href="#" id="mockArticleList">Articles about PA</a></li>
                <li><a href="#" id="mockArticleList">Interviews</a></li>
                <li><a href="#" id="mockArticleList">Transcripts</a></li>
                <li><a href="#" id="mockArticleList">Acknowledgements</a></li>
            </ul>
        </div> <!-- .showcase-links -->
        <div class="fixed container" id="showcaseContainer">
            <?php
                //if ( isset($_SERVER['QUERY_STRING']) ) {
                    $_GET['template'] = $q;

                    if ( substr_count($q, 'List') > 0 ) {
                        include('includes/list-showcase.php');
                    } else if ( substr_count($q, 'Gallery') > 0 ) {
                        include('includes/image-showcase.php');
                    //}
                } else {
                    $_GET['template'] = 'mockBio';
                    include('includes/text-showcase.php');
                }
            ?>

        </div> <!-- .container -->

    </div> <!-- .viewer -->
<?php include("includes/footer.php"); ?>
