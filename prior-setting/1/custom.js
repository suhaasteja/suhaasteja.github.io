var container, alpha, beta;

function get_priors() {
  container = document.querySelectorAll('.r2d3');
  str_alpha = container[0].shadowRoot.querySelector(".text-eff-prior").innerHTML;
  prior_alpha = str_alpha.split(" ")[2];
  str_beta = container[1].shadowRoot.querySelector(".text-eff-prior").innerHTML;
  prior_beta = str_beta.split(" ")[2];
  
  url = 'https://umich.qualtrics.com/jfe/form/SV_ebP6FaVE8j2JzZH?alpha='+prior_alpha+'&beta='+prior_beta;
  
  window.open(url, "_blank");
}

function show_section(id) {
  $('div#'+id).css('visibility', 'visible');
  
  if (id == 'interactive-visualization') {
    $('div#part-2').css('visibility', 'visible');
  }
  
  $('button.'+id+'-btn').hide();
}

$("#btn-pg-2").click(function(){
		text = $(this).text().split(" ")[0];
    
    if (text == "Show") {
    		$('div#experiment-details').css('display', 'inherit');
    } else {
    		$('div#experiment-details').css('display', 'none');
    }
    
		$(this).text(function(i, text){
          return text === "Show experiment details" ? "Hide experiment details" : "Show experiment details";
     });
} );