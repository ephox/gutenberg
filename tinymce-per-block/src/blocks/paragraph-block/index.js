/**
 * External dependencies
 */
import { registerBlock } from 'wp-blocks';
import { EditorParagraphIcon } from 'dashicons';

/**
 * Internal dependencies
 */
import form from './form';

registerBlock( 'paragraph', {
	title: 'Paragraph',
	form: form,
	icon: EditorParagraphIcon,
	parse: ( rawBlock ) => {
		const div = document.createElement( 'div' );
		div.innerHTML = rawBlock.rawContent;
		if (
			div.childNodes.length !== 1 ||
			div.firstChild.nodeName !== 'P'
		) {
			return false;
		}

		return {
			blockType: 'paragraph',
			align: rawBlock.attrs.align || 'no-align',
			content: div.firstChild.innerHTML,
		};
	},
	serialize: ( block ) => {
		const div = document.createElement( 'div' );
		div.innerHTML = block.content;
		// Should probably be handled in the form
		const content = div.childNodes.length === 1 && div.firstChild.nodeName === 'P'
			? div.firstChild.innerHTML
			: block.content;
		const rawContent = `<p style="text-align: ${ block.align };">${ content }</p>`;

		return {
			blockType: 'paragraph',
			attrs: { /* align: block.align */ },
			rawContent
		};
	}
} );
