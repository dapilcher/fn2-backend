import React from 'react';
import { NotEditable, component, fields } from '@keystone-6/fields-document/component-blocks';

// naming the export componentBlocks is important because the Admin UI
// expects to find the components like on the componentBlocks export
export const componentBlocks = {
  quote: component({
    preview: (props) => {
      return (
        <div
          style={{
            background: '#ecf0f4',
            padding: 16,
            borderRadius: 8,
            margin: 0,
          }}
        >
          <div style={{ fontStyle: 'italic', color: '#4A5568', margin: 0, padding: 0 }}>{props.fields.content.element}</div>
          <div style={{ fontWeight: 'bold', color: '#718096', margin: 0, padding: 0 }}>
            <NotEditable>— </NotEditable>
            {props.fields.attribution.element}
          </div>
        </div>
      );
    },
    label: 'Quote',
    schema: {
      content: fields.child({
        kind: 'block',
        placeholder: 'Quote...',
        formatting: { inlineMarks: 'inherit', softBreaks: 'inherit' },
        links: 'inherit',
      }),
      attribution: fields.child({ kind: 'inline', placeholder: 'Attribution...' }),
    },
    chromeless: true,
  }),
  dropCap: component({
    preview: (props) => {
      return (
        <span style={{
          float: "left",
          fontSize: "75px",
          lineHeight: "60px",
          paddingTop: "4px",
          paddingRight: "8px",
          paddingLeft: "3px",
        }}>{props.fields.letter.element}</span>
      )
    },
    label: 'Drop Cap',
    schema: {
      letter: fields.child({
        kind: 'inline',
        placeholder: 'A',
      })
    },
    chromeless: true
  })
};