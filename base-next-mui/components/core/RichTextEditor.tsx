import Color from "@tiptap/extension-color";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import {
  MenuButtonAddTable,
  MenuButtonAlignCenter,
  MenuButtonAlignJustify,
  MenuButtonAlignLeft,
  MenuButtonAlignRight,
  MenuButtonBlockquote,
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonEditLink,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuButtonRedo,
  MenuButtonStrikethrough,
  MenuButtonSubscript,
  MenuButtonSuperscript,
  MenuButtonTextColor,
  MenuButtonUnderline,
  MenuButtonUndo,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor as MuiRichTextEditor,
  RichTextEditorRef as MuiRichTextEditorRef,
  TableBubbleMenu,
} from "mui-tiptap";
import { ForwardedRef, forwardRef, useImperativeHandle, useRef } from "react";

type RichTextEditorProps = {
  defaultContent: string;
};

export type RichTextEditorRef = {
  content?: string;
};

function RichTextEditor(
  { defaultContent }: RichTextEditorProps,
  ref: ForwardedRef<RichTextEditorRef>
) {
  const rteRef = useRef<MuiRichTextEditorRef>(null);

  useImperativeHandle(ref, () => ({
    content: rteRef.current?.editor?.getHTML(),
  }));

  const extensions = [
    StarterKit.configure({
      heading: {
        levels: [2, 3, 4, 5, 6],
      },
    }),
    Superscript,
    Subscript,
    Underline,
    TextAlign,
    Table,
    TableCell,
    TableHeader,
    TableRow,
    Color,
    TextStyle,
  ];

  return (
    <div className="shadow-sm">
      <MuiRichTextEditor
        ref={rteRef}
        extensions={extensions}
        content={defaultContent}
        onUpdate={({ editor }) => {
          // Force the ref to update its content
          if (ref && typeof ref === "object" && ref.current) {
            ref.current.content = editor.getHTML();
          }
        }}
        renderControls={() => (
          <MenuControlsContainer className="px-4 py-2">
            <div className="flex items-center gap-2 flex-wrap">
              <MenuSelectHeading className="rounded p-1" />
              <MenuDivider className="!mx-2 !h-6" />
              <MenuButtonBold className="rounded p-1" />
              <MenuButtonItalic className="rounded p-1" />
              <MenuButtonUnderline className="rounded p-1" />
              <MenuButtonTextColor className="rounded p-1" />
              <MenuDivider className="!mx-2!h-6" />
              <MenuButtonAlignLeft className="rounded p-1" />
              <MenuButtonAlignCenter className="rounded p-1" />
              <MenuButtonAlignRight className="rounded p-1" />
              <MenuButtonAlignJustify className="rounded p-1" />
              <MenuDivider className="!mx-2 !h-6" />
              <MenuButtonSuperscript className="rounded p-1" />
              <MenuButtonSubscript className="rounded p-1" />
              <MenuButtonStrikethrough className="rounded p-1" />
              <MenuButtonBlockquote className="rounded p-1" />
              <MenuDivider className="!mx-2 !h-6" />
              <MenuButtonOrderedList className="rounded p-1" />
              <MenuButtonBulletedList className="rounded p-1" />
              <MenuButtonEditLink className="rounded p-1" />
              <MenuButtonAddTable className="rounded p-1" />
              <TableBubbleMenu className="rounded p-1" />
              <MenuDivider className="!mx-2!h-6" />
              <MenuButtonUndo className="rounded p-1" />
              <MenuButtonRedo className="rounded p-1" />
            </div>
          </MenuControlsContainer>
        )}
        RichTextFieldProps={{
          className: "min-h-[400px] p-4 prose max-w-none",
        }}
      />
    </div>
  );
}

// Add this CSS to your global styles or a CSS module
const fixListStyles = `
  .ProseMirror ul,
  .ProseMirror ol {
    padding-left: 2rem;
    margin: 0.5rem 0;
  }

  .ProseMirror ol {
    counter-reset: item;
  }

  .ProseMirror {
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    line-height: 1.75;
    min-height: 400px;
  }

  .ProseMirror:focus-visible {
    outline: none;
  }

  .ProseMirror h1 { font-size: 2rem; margin: 1rem 0; }
  .ProseMirror h2 { font-size: 1.75rem; margin: 0.875rem 0; }
  .ProseMirror h3 { font-size: 1.5rem; margin: 0.75rem 0; }
`;

// Add the global styles in your component
const styleElement = document.createElement("style");
styleElement.innerHTML = fixListStyles;
document.head.appendChild(styleElement);

export default forwardRef(RichTextEditor);
