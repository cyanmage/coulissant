var appli = angular.module('appli', ['defileur', 'fonctionsCourantes']);
var module_defileur = angular.module('defileur', []);

appli.config(['$interpolateProvider', function($interpolateProvider) {

  	$interpolateProvider.startSymbol('{{');
  	$interpolateProvider.endSymbol('}}');    
       }
]);






/*/////////////////////////////////////////////////////////////////////////////////*/
///////////////////////////////////////////////////////////////////////////////////*/
/*                                                                                 */
/*                                                                                 */
/*                    Controleur associé au défileur                               */
/*                                                                                 */
/*                                                                                 */
///////////////////////////////////////////////////////////////////////////////////*/
/////////////////////////////////////////////////////////////////////////////////////


module_defileur.controller("controleurDefileur", ['$scope', '$q',	function($scope, $q){

		$scope.direction = "";
		$scope.modele = "wazzz";
		$scope.methode = "directives";

}]);



/*#############################             ###############################          ################################*/
/*#############################             ###############################          ################################*/
/*#############################             ###############################          ################################*/

//													  DIRECTIVES

/*#############################             ###############################          ################################*/
/*#############################             ###############################          ################################*/
/*#############################             ###############################          ################################*/


module_defileur.directive('defileur', ['$q', function($q){
 	return {
 		restrict: 'AE',
 		scope : {
 			methode : " = "
 		},
 		//transclude : true,
 		//controller : "controleurDefileur",
 		link : function(scope, element, attributes){
 			//console.log("scope id du defileur : " + scope.$id + ",   modele direction : " + scope.direction);
			console.log("defileur");
			console.log(element); 			
			console.log(scope.$id);
 		}
	}
}]);/**/





module_defileur.directive('panneauDefileur', ['gestionDesPanneaux', function(panneaux){

	return {
		restrict : 'AE',
		transclude : true,
		template : '<div class = "panneau" direction="direction"><div ng-transclude></div><div>Direction : {{direction}}</div></div>', 
		replace : true, 
		scope : {
			direction : " = "
		},
		controller : ['$scope', function($scope){

		}],
		link : function(scope, element, attributes, controleurDefileur){
		


			/*console.log("panneau");
			console.log(element); 			
			console.log(scope.$id);*/
			scope.$watch('direction', function(newValue, oldValue, scope){
				if (newValue !== oldValue){
					if (scope.direction == "gauche")
						panneaux.permuteGauche(element);
					else if (scope.direction == "droite")
						panneaux.permuteDroite(element);	
					console.log("CHANGEMEEEEEENT !!! :) ---> "  + scope.direction);	
				}

			});



			element.on("transitionend", function(event, data){
				if(element.attr("emplacement") == "centre"){
					scope.direction = "";
					scope.$apply();
				}						
				event.stopPropagation();
			});/**/
		}

	}

}]);



module_defileur.directive('directionDroite', function(){

	return {
		restrict : 'AE',
		template : "<div direction='direction'></div>",
		link : function(scope, element, attributes, controller) {
			element.on("click", function(event){
				scope.direction = "droite";					
				console.log("avant : " + scope.direction + ", scope id de la fleche droite : " + scope.$id);
				scope.$apply();	
				if (!scope.direction){
					scope.direction = "droite";		

					console.log("direction : " + scope.direction);	
				}
			});	
		}	
	}

});


module_defileur.directive('directionGauche', function(){

	return {
		restrict : 'AE',
		template : "<div direction = 'direction'></div>",
		link : function(scope, element, attributes) {
			element.on("click", function(event){
				scope.direction = "gauche";					
				console.log("avant : " + scope.direction + ", scope id de la fleche gauche : " + scope.$id);		
				scope.$apply();	
				if (!scope.direction){
					scope.direction = "gauche";	
	
					console.log("direction : " + scope.direction);	
				}
			});	
		}	
	}

});








/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************            LES SERVICES         ***************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/


module_defileur.factory('servicesEvenements', ['$q', function($q){
	var les_services_evenements = {};

	les_services_evenements.mouvement = "";


	return les_services_evenements;
}]);








module_defileur.factory('gestionDesPanneaux',['$q', function($q){
	var gestion_des_panneaux = {};

	var animation_en_cours = false;	


	gestion_des_panneaux.permuteDroite = function(element){
		var emplacement = element.attr('emplacement');		
		if (emplacement == "gauche"){
			element.addClass("noTransition");
			element.attr("emplacement", "droite");
			element.height();  // hack : indispensable pour forcer le reflow et que la transition "noTransition" soit appliquée ! 
			element.removeClass("noTransition");					
		}
		else if(emplacement == "centre")
			element.attr("emplacement", "gauche");
		else if (emplacement == "droite")
			element.attr("emplacement", "centre");
	}		

	gestion_des_panneaux.permuteGauche = function(element){
		var emplacement = element.attr('emplacement');			
		if (emplacement == "droite"){
			element.addClass("noTransition");
			element.attr("emplacement", "gauche");
			element.height();  // hack : indispensable pour forcer le reflow et que la transition "noTransition" soit appliquée ! 
			element.removeClass("noTransition");								
		}
		else if(emplacement == "centre")
			element.attr("emplacement", "droite");
		else if (emplacement == "gauche")
			element.attr("emplacement", "centre");
	}		

	gestion_des_panneaux.finDefilement = function(scope, element){
		if(element.attr("emplacement") == "centre")
			scope.$emit("transitionPanneauTerminee");
	}


	return gestion_des_panneaux;
}]);






var module_fonctions_courantes = angular.module('fonctionsCourantes', []);

module_fonctions_courantes.factory('fonctionsCourantes', function(){


	var fonctions_courantes = {};
	var transitionEnd = whichTransitionEvent();
	//console.log(transitionEnd);



	function whichTransitionEvent(){
	    var t;
	    var el = document.createElement('fakeelement');
	    var transitions = {
	      'transition':'transitionend',
	      'OTransition':'oTransitionEnd',
	      'MozTransition':'transitionend',
	      'WebkitTransition':'webkitTransitionEnd'
	    }
	
	    for(t in transitions){
	        if( el.style[t] !== undefined ){
	            return transitions[t];
	        }
	    }
	}

	fonctions_courantes.getVendorTransitionEnd = function(){
		return transitionEnd;
	}
	
	return fonctions_courantes;
});

