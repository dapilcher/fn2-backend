import React from "react";
import {
  NotEditable,
  component,
  fields,
} from "@keystone-6/fields-document/component-blocks";

// naming the export componentBlocks is important because the Admin UI
// expects to find the components like on the componentBlocks export
export const componentBlocks = {
  quote: component({
    preview: (props) => {
      return (
        <div
          style={{
            background: "#ecf0f4",
            padding: 16,
            borderRadius: 8,
            margin: 0,
          }}
        >
          <div
            style={{
              fontStyle: "italic",
              color: "#4A5568",
              margin: 0,
              padding: 0,
            }}
          >
            {props.fields.content.element}
          </div>
          {props.fields.attribution.discriminant ? (
            <div
              style={{
                fontWeight: "bold",
                color: "#718096",
                margin: 0,
                padding: 0,
              }}
            >
              <NotEditable>— </NotEditable>
              {props.fields.attribution.value.fields.text.element}
            </div>
          ) : null}
        </div>
      );
    },
    label: "Quote",
    schema: {
      content: fields.child({
        kind: "inline",
        placeholder: "Quote...",
        formatting: { inlineMarks: "inherit", softBreaks: "inherit" },
        links: "inherit",
      }),
      attribution: fields.conditional(
        fields.checkbox({ label: "Include attribution" }),
        {
          false: fields.empty(),
          true: fields.object({
            text: fields.child({
              kind: "inline",
              placeholder: "Attribution...",
            }),
          }),
        }
      ),
    },
    chromeless: true,
  }),
  dropCap: component({
    preview: (props) => {
      return (
        <span
          style={{
            float: "left",
            fontSize: "75px",
            lineHeight: "60px",
            paddingTop: "4px",
            paddingRight: "8px",
            paddingLeft: "3px",
          }}
        >
          {props.fields.letter.element}
        </span>
      );
    },
    label: "Drop Cap",
    schema: {
      letter: fields.child({
        kind: "inline",
        placeholder: "A",
      }),
    },
    chromeless: true,
  }),
  documentImage: component({
    preview: (props) => {
      return (
        <>
          <NotEditable>
            {props.fields.image?.value?.data ? (
              <img
                src={props.fields.image?.value?.data.image.url}
                style={{ width: "100%" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "5rem",
                  border: "1px solid lightgray",
                  color: "lightgray",
                  fontStyle: "italic",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Could not find image...
              </div>
            )}
          </NotEditable>
          <p style={{ color: "gray", fontStyle: "italic" }}>
            {props.fields.caption?.element}
          </p>
        </>
        // <div
        //   style={{
        //     backgroundColor: "white",
        //     backgroundImage: `url(${props.fields.image.value?.data.image.url})`,
        //     backgroundPosition: "center",
        //     backgroundSize: "cover",
        //     display: "flex",
        //     flexDirection: "column",
        //     fontSize: 28,
        //     justifyContent: "space-between",
        //     minHeight: 200,
        //     padding: 16,
        //     width: "100%",
        //   }}
        // >
        //   <div
        //     style={{
        //       color: "white",
        //       fontWeight: "bold",
        //       fontSize: 48,
        //       textAlign: "center",
        //       margin: 16,
        //       textShadow: "0px 1px 3px black",
        //     }}
        //   >
        //     {props.fields.caption.element}
        //   </div>
        // </div>
      );
    },
    label: "Document Image",
    schema: {
      caption: fields.child({ kind: "inline", placeholder: "Caption..." }),
      image: fields.relationship({
        label: "Image",
        listKey: "Image",
        selection: "image {url height width} altText",
      }),
      altText: fields.text({ label: "Alt text", defaultValue: "" }),
    },
  }),
  numberedHeading: component({
    preview: (props) => {
      // console.log({ props });
      return (
        <>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <span
              style={{
                display: "block",
                width: "100%",
                height: "0.25rem",
                backgroundColor: "red",
              }}
            />
            <span
              style={{
                height: "1rem",
                width: "1rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                border: "0.25rem solid red",
                borderRadius: "50%",
                padding: "1.5rem",
                fontWeight: "bold",
                fontSize: "24px",
              }}
            >
              {props.fields.number?.element}
            </span>
            <span
              style={{
                display: "block",
                width: "100%",
                height: "0.25rem",
                backgroundColor: "red",
              }}
            />
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h2>{props.fields.text?.element}</h2>
          </div>
        </>
      );
    },
    label: "Numbered Heading",
    schema: {
      text: fields.child({ kind: "inline", placeholder: "Title" }),
      number: fields.child({ kind: "inline", placeholder: "1" }),
    },
  }),
};
