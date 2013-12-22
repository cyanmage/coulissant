(function(){

	var tableau_des_dates = {};



	function calculeDates(panneau, position, debutSemaine){
		var finSemaine = new Date(debutSemaine);
		//console.log(debutSemaine);

		finSemaine.setDate(debutSemaine.getDate() + 6) ;
		//onsole.log(finSemaine);	
		texte_date = "Semaine du " + debutSemaine.getDate() + "/" + (debutSemaine.getMonth() + 1)  +  "/"  +  debutSemaine.getFullYear();
		texte_date +=  " au " 	   + finSemaine.getDate()   + "/" + (finSemaine.getMonth() + 1)    +  "/"  +  finSemaine.getFullYear();
		//console.log(debutSemaine.getDate() + 6);

		//console.log("." + panneau);
		//console.log($(".leftPanel"));		

		champDate			= $("." + panneau).find(".champDate");
		//console.log(champDate.attr("id"));		
		champDate.text(texte_date);	

		tableau_des_dates[position] = [debutSemaine, finSemaine];

		//console.log(tableau_des_dates);		
	}

	function initialiseBufferDates(){
		var dateAvant = new Date(), dateMaintenant = new Date(), dateApres = new Date();
		var day = dateMaintenant.getDay();

		diff = dateMaintenant.getDate() - day + (day == 0 ? -6:1); 
		console.log(dateMaintenant);
		//console.log(d.getDate() - day + (day == 0 ? -6:1));
		//console.log(new Date(d.setDate(diff + 7)));


		calculeDates("centerPanel", 1, new Date(dateMaintenant.setDate(diff)));
		calculeDates("leftPanel", 0, new Date(dateAvant.setDate(diff - 7)));		
		calculeDates("rightPanel", 2, new Date(dateApres.setDate(diff + 7)));

	}

	function metAJourBufferDates(decalage){

		if (decalage == "shiftRight"){
			//var temp = 
			//tableau_des_dates[1]
			tableau_des_dates[0] = tableau_des_dates[1];
			tableau_des_dates[1] = tableau_des_dates[2];
			var d = new Date(tableau_des_dates[2][0]);
			calculeDates("leftPanel", 2, new Date(d.setDate(d.getDate() + 7)));				
			//console.log("a droite");
			//calculeDates(champDateAvant, 2, new Date(d.setDate(diff)));			
		}
		else 
		if (decalage == "shiftLeft"){
			tableau_des_dates[2] = tableau_des_dates[1];
			tableau_des_dates[1] = tableau_des_dates[0];
			var d = new Date(tableau_des_dates[0][0]);
			calculeDates("rightPanel", 0, new Date(d.setDate(d.getDate() - 7)));	
			//console.log("a gauche");			
		}

		//console.log(tableau_des_dates);

	}/**/


	$(document).ready(function(){
	
		var animation_en_cours = false;
		initialiseBufferDates();


	//////////////////////////////////////////
		$("#rightArrow").on('click', function(){
			if (! animation_en_cours){
				animation_en_cours = true ;
	
				$(".centerPanel").animate(
								{"left" : "-=100%"},
								"slow"
					);
				$(".rightPanel").animate(
								{"left" : "-=100%"},
								"slow"
					)
	 			.queue(function(){
					metAJourBufferDates("shiftRight");
					$(this).dequeue();	 				
	 			})				
				.queue(function(){
	 				console.log("fini gauche !");			
					$(".leftPanel").css("left", "100%");

					var centre = $(".centerPanel"), droite = $(".rightPanel"), gauche = $(".leftPanel");	
		
					centre.removeClass("centerPanel");
					droite.removeClass("rightPanel").addClass("centerPanel");
					gauche.removeClass("leftPanel").addClass("rightPanel");
					centre.addClass("leftPanel");
	
					animation_en_cours = false ;				
					$(this).dequeue();
				});


			}
			
	
		});
	
	///////////////////////////////////////////
	 	$("#leftArrow").on('click', function(){
			if (! animation_en_cours){
				animation_en_cours = true ;
	
	 			$(".centerPanel").animate(
	 							{"left" : "+=100%"},
	 							"slow"
	 				);
	 			$(".leftPanel").animate(
	 							{"left" : "+=100%"},
	 							"slow"
	 				)
	 			.queue(function(){
					metAJourBufferDates("shiftLeft");
					$(this).dequeue();	 				
	 			})
	 			.queue(function(){
	 				console.log("fini droite !");
					$(".rightPanel").css("left", "-100%");

					var centre = $(".centerPanel"), droite = $(".rightPanel"), gauche = $(".leftPanel");	
		
					centre.removeClass("centerPanel");
					droite.removeClass("rightPanel").addClass("leftPanel");
					gauche.removeClass("leftPanel").addClass("centerPanel");
					centre.addClass("rightPanel");
	
					animation_en_cours = false ;		
					$(this).dequeue();
				});


			}
	
	 	});
	
	});


})	();