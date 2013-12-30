var appli = angular.module('appli', ['defileur', 'fonctionsCourantes']);
var module_defileur = angular.module('defileur', []);

appli.config(['$interpolateProvider', '$provide', function($interpolateProvider, $provide) {
  	
  	$interpolateProvider.startSymbol('{{');
  	$interpolateProvider.endSymbol('}}');  


    $provide.decorator('$rootScope', ['$delegate', function($delegate){
     Object.defineProperty($delegate.constructor.prototype, '$onRootScope', {
            value: function(name, listener){
                var unsubscribe = $delegate.$on(name, listener);
                this.$on('$destroy', unsubscribe);
            },
            enumerable: false
        });
     return $delegate;
    }]);  	  
 

}]);




/*/////////////////////////////////////////////////////////////////////////////////*/
///////////////////////////////////////////////////////////////////////////////////*/
/*                                                                                 */
/*                                                                                 */
/*                    Controleur associé au défileur                               */
/*                                                                                 */
/*                                                                                 */
///////////////////////////////////////////////////////////////////////////////////*/
/////////////////////////////////////////////////////////////////////////////////////


module_defileur.controller("controleurDefileur", ['$q', 'gestionDesPanneaux', '$scope', 'servicesEvenements',
	function($q, gestionDesPanneaux, $scope, servicesEvenements){

 	$scope.gestionDesPanneaux = gestionDesPanneaux;
 	$scope.servicesEvenements = servicesEvenements;
	$scope.methode = "signaux"; 	


	/*$scope.$on("IChangedDirection", function(event, data){
		//console.log(data);
		$scope.$broadcast("signaleChangementDirection", data);
	});
	$scope.direction = "aucune";*/

	/*$scope.$watch("direction", function(){
		console.log("test scope dans le controleur" + $scope.direction);
	}) ;*/

}]);



/*#############################             ###############################          ################################*/
/*#############################             ###############################          ################################*/
/*#############################             ###############################          ################################*/

//													  DIRECTIVES

/*#############################             ###############################          ################################*/
/*#############################             ###############################          ################################*/
/*#############################             ###############################          ################################*/


module_defileur.directive('defileur', ['$q','gestionDesPanneaux', 'fonctionsCourantes', function($q, panneaux, fonctionsCourantes){
 	return {
 		restrict: 'AE',
 		scope : {
 			methode : "="
 		},
 		link : function(scope, element, attributes){
 			//transitionEnd  =  fonctionsCourantes.getVendorTransitionEnd();
 			//console.log(transitionEnd);	
 		}

	}
}]);


module_defileur.directive('directionDroite', ['gestionDesPanneaux',  'fonctionsCourantes', 'servicesEvenements', '$rootScope',  
	function(panneaux, fonctionsCourantes, servicesEvenements, $rootScope ){

	return {
		restrict : 'AE',
		transclude : true,
		template : '<div ng-transclude></div>',

		link : function(scope, element, attributes) {
			var defilementEnCours = false;

			element.on("click", function(event){

				if (!defilementEnCours){
					console.log(defilementEnCours );
					defilementEnCours = true;
					$rootScope.$emit("fleche.signaleChangementDirection", "flecheDroite");	
				}

			});	

			/*scope.$on("transitionPanneauTerminee", function(event, data){
					defilementEnCours = false;
				});	*/
				scope.$onRootScope("panneau.transitionTerminee", function(event, data){
					defilementEnCours = false;
				});

		}	

	}

}]);

module_defileur.directive('directionGauche', ['gestionDesPanneaux',  'fonctionsCourantes', 'servicesEvenements', '$rootScope',
	function(panneaux, fonctionsCourantes, servicesEvenements, $rootScope ){

	return {
		restrict : 'AE',
		transclude : true,
		template : '<div ng-transclude></div>',
	
		link : function(scope, element, attributes) {
			var defilementEnCours = false;

			element.on("click", function(event){

				if (!defilementEnCours){
					console.log(defilementEnCours );
					defilementEnCours = true;
					$rootScope.$emit("fleche.signaleChangementDirection", "flecheGauche");	
				}				

			});	

			/*scope.$on("transitionPanneauTerminee", function(event, data){
					defilementEnCours = false;
					//console.log("defilement en cours : " + defilementEnCours);						
				});			*/	

			scope.$onRootScope("panneau.transitionTerminee", function(event, data){
					defilementEnCours = false;
			});		

		}	

	}

}]);



module_defileur.directive('panneauDefileur', ['gestionDesPanneaux', 'servicesEvenements', '$rootScope',
	function(panneaux, servicesEvenements, $rootScope){


	return {
		restrict : 'AE',
		transclude : true,	
		template : '<div class = "panneau" ng-transclude></div>', 
		replace : true, 
		scope : {},
		link : function(scope, element, attributes){

			element.on("transitionend", function(event, data){
							if(element.attr("emplacement") == "centre"){
								$rootScope.$emit("panneau.transitionTerminee");	
								//console.log("j'ai termine");
								//console.log(event.target);
								//servicesEvenements.mouvement = "";
								//scope.$apply();
								}						
							event.stopPropagation();
							//panneaux.finDefilement(scope, element);
								
						});/**/

			/*scope.$on("signaleChangementDirection", function(event, data){
				data == 'flecheDroite'  ? panneaux.permuteGauche(element) : panneaux.permuteDroite(element);
			});*/


			scope.$onRootScope("fleche.signaleChangementDirection", function(event, data){
				data == 'flecheGauche'  ? panneaux.permuteGauche(element) : panneaux.permuteDroite(element);
			});

		}

	}

}]);






/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************            LES SERVICES         ***************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/


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

