/**
 * External dependencies
 */
import { createElement, Component } from 'wp-elements';
import { EditableComponent } from 'wp-blocks';

export default class InlineTextBlockForm extends Component {
	merge = ( block, index ) => {
		const acceptedBlockTypes = [ 'quote', 'paragraph', 'heading' ];
		if ( acceptedBlockTypes.indexOf( block.blockType ) === -1 ) {
			return;
		}

		const getLeaves = html => {
			const div = document.createElement( 'div' );
			div.innerHTML = html;
			if ( div.childNodes.length === 1 && div.firstChild.nodeName === 'P' ) {
				return getLeaves( div.firstChild.innerHTML );
			}
			return html;
		};

		const { block: { content }, remove, change } = this.props;
		remove( index );
		setTimeout( () => change(
			{ content: getLeaves( content ) + getLeaves( block.content ) }
		) );
		setTimeout( () => this.editable.updateContent() );
	}

	bindEditable = ( ref ) => {
		this.editable = ref;
	}

	executeCommand = ( ...args ) => {
		this.editable.executeCommand( ...args );
	};

	render() {
		const { block, change, moveUp, moveDown, appendBlock,
			mergeWithPrevious, remove, setToolbarState, focus, focusConfig } = this.props;

		const splitValue = ( left, right ) => {
			change( { content: left } );
			setTimeout( () => this.editable.updateContent() );
			if ( right ) {
				appendBlock( {
					...block,
					content: right
				} );
			} else {
				appendBlock();
			}
		};

		return (
			<EditableComponent
				ref={ this.bindEditable }
				content={ block.content }
				moveUp={ moveUp }
				moveDown={ moveDown }
				splitValue={ splitValue }
				mergeWithPrevious={ mergeWithPrevious }
				remove={ remove }
				onChange={ ( value ) => change( { content: value } ) }
				setToolbarState={ setToolbarState }
				focusConfig={ focusConfig }
				onFocusChange={ focus }
				inline
				single
			/>
		);
	}
}
