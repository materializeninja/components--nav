export default class Nav {
	
	nav; // built in constructor

    constructor ( ...args ) {

        const options = Object.assign( {
            links: [ ]
        }, args[ 0 ] );

        this.nav = this.buildMenuHTML( options.links );
		
		_n.onNodeInsert( "nav", node => {
			
			this.init( );
			
		} );

	}
	
	init ( ) {

		_n.onNodeInsert( "nav-toggle", node => {

			_n.on( document.getElementsByTagName( "nav-toggle" )[ 0 ], "click.toggleNav", event => {

				let navNode = document.getElementsByTagName( "nav" )[ 0 ];

				document.body.classList.add( "show-nav" );

				setTimeout( ( ) => {

					_n.on( document.body, "click.hideNav", event => {

						if ( event.target === navNode ){ return };

						document.body.classList.remove( "show-nav" );

						_n.off( document.body, "click.hideNav" );
						_n.off( document.body, "swipeleft.hideNav" );

					} );

					_n.on( document.body, "swipeleft.hideNav", event => {

						if ( event.target === navNode ){ return; };

						document.body.classList.remove( "show-nav" );

						_n.off( document.body, "click.hideNav" );
						_n.off( document.body, "swipeleft.hideNav" );

					} );

				}, 1000 );

			} );

		} );

		_n.on( document.getElementsByTagName( "nav" )[ 0 ].querySelectorAll( "a" ), "click.hijackNavClick", event => {
			
			let anchor_node = event.target;
			
			if ( anchor_node.nodeName !== "A" ) {

				/**
				 * This is not an achor tag more than likely we've
				 * Gotten a child node and need to get the anchor wrapper
				 */
				anchor_node = anchor_node.parentElement;
				
			}
			
			let parentLI = anchor_node.parentElement;
			let href = anchor_node.getAttribute( "href" ); // using getAttribute because calling straight href adds protocol & baseurl
			
			if ( href !== null ) {
			
				let checkForHashRegex = new RegExp( "^(#)" );
				let currentSelection = document.getElementsByTagName( "nav" )[ 0 ].querySelector( "li.current" );
				
				if ( currentSelection ) {
					
					currentSelection.classList.remove( "current" );
					
				}
				
				parentLI.classList.add( "current" );
				
				if ( checkForHashRegex.test( href ) ) {

					if ( ! event.metaKey ) {

						window.location.hash = href;

					}
					
				}
			
			}
			
			return;
			
		} );

		_n.on( document.querySelectorAll( "nav li.toggle > a" ), "click.toggle", event => {

            event.stopImmediatePropagation( );

			let currentSelection = event.target;
			let li = event.target.parentNode;
			let nextUL = li.querySelector( "ul" );

			li.classList.toggle( "show" );
			nextUL.classList.toggle( "show" );

			this.calcNavHeight( currentSelection );

        } );
		
		this.loadCurrentlySelected( );
		
	}

	calcNavHeight ( currentSelection ) {

		let navLinks = currentSelection.closest( "nav" ).querySelector( "ul" );

		// calc height of all children in reverse so we can build up to parent
		[ ...navLinks.querySelectorAll( "ul" ) ].reverse( ).forEach( n => {

			// init height 0
			var newHeight = 0;

			// if showing then we need to calc new heights
			if ( n.classList.contains( "show" ) ) {

				// calc initial height of direct children
				newHeight += ( n.children.length * 56 );

				// calc height of all showing children
				newHeight += [ ...n.querySelectorAll( "ul.show" ) ].reduce( ( a, b ) => {

					return a + ( b.children.length * 56 );

				}, 0 );

			}

			n.style.maxHeight = `${ newHeight }px`;

		} );
	
	}
	
	buildMenuHTML ( linksObjArray ) {
		
		function recursiveCall ( linksObjArray ) {
		
			let linkHTML = ``;
		
			for ( let linkData of Object.values( linksObjArray ) ) {
				
				let subNavHTML = ``;
				let subClass = ``;
				let linkText = ``;
                let icon = linkData.icon !== undefined ? `<i class="${ linkData.icon }"></i> ` : ``;
				
				if ( linkData.links !== undefined ) {
					
					subNavHTML = recursiveCall( linkData.links );
					subClass = `toggle`;
					
				}
				
				if ( linkData.link === undefined ) {
					
					linkText = `<a>${ icon }${ linkData.text }</a>`;
					
				} else {
					
					linkText = `<a href='${ linkData.link }'>${ icon }${ linkData.text }</a>`;
					
				}
				
				linkHTML = `${ linkHTML }<li class="${ subClass }">${ linkText }${ subNavHTML }</li>`;
				
			}
			
			linkHTML = `<ul>${ linkHTML }</ul>`;
			
			return linkHTML;
		
		}
		
		let navHTML = recursiveCall( linksObjArray );
		
		return `
			<nav>
				<heading>
				</heading>
				${ navHTML }
				<footing>
					<!-- div class="social">
						<a href="https://www.facebook.com/knotmastersguild" target="_blank"><i class="n n-facebook"></i></a>
						<a href="https://twitter.com/knotmastersgild" target="_blank"><i class="n n-twitter"></i></a>
						<a href="https://instagram.com/knotmastersguild" target="_blank"><i class="n n-instagram"></i></a>
					</div -->
				</footing>
			</nav>
		`;
		
	}
	
	loadCurrentlySelected ( ) {
		
		let currentSelection = document.querySelector( `a[href="${window.location.hash}"]` );
		
		if ( currentSelection !== null ) {
			
			let currentSelectionLI = currentSelection.parentElement
			
			currentSelectionLI.classList.add( "current" );

			this.toggleParentNodes( currentSelectionLI );
		
		}
	
	}
	
	toggleParentNodes ( nodeLI ) {
		
		let nodeUL = nodeLI.parentElement;
		let nextLI = nodeUL.parentElement;

		if ( nextLI.classList.contains( "toggle" ) ) {
			
			nodeUL.classList.add( "show" );
			nextLI.classList.add( "show" );

			this.toggleParentNodes( nextLI );
			
		} else {

			this.calcNavHeight( nodeLI );

		}
		
	}

	get html ( ) {
	
		return this.nav;

	}
	
}
