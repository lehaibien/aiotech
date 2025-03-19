import StarterKit from "@tiptap/starter-kit";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Underline from "@tiptap/extension-underline";
import {
  MenuButtonBlockquote,
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuButtonStrikethrough,
  MenuButtonSubscript,
  MenuButtonSuperscript,
  MenuButtonUnderline,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor as MuiRichTextEditor,
  RichTextEditorRef as MuiRichTextEditorRef,
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

  const extensions = [StarterKit, Superscript, Subscript, Underline];

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
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
          <MenuControlsContainer className="px-4 py-2 bg-gray-50 border-b border-gray-200 rounded-t-lg">
            <div className="flex items-center gap-2 flex-wrap">
              <MenuSelectHeading className="hover:bg-gray-100 rounded p-1" />
              <MenuDivider className="!mx-2 !h-6" />
              <MenuButtonBold className="hover:bg-gray-100 rounded p-1" />
              <MenuButtonItalic className="hover:bg-gray-100 rounded p-1" />
              <MenuButtonUnderline className="hover:bg-gray-100 rounded p-1" />
              <MenuDivider className="!mx-2 !h-6" />
              <MenuButtonSuperscript className="hover:bg-gray-100 rounded p-1" />
              <MenuButtonSubscript className="hover:bg-gray-100 rounded p-1" />
              <MenuButtonStrikethrough className="hover:bg-gray-100 rounded p-1" />
              <MenuButtonBlockquote className="hover:bg-gray-100 rounded p-1" />
              <MenuDivider className="!mx-2 !h-6" />
              <MenuButtonOrderedList className="hover:bg-gray-100 rounded p-1" />
              <MenuButtonBulletedList className="hover:bg-gray-100 rounded p-1" />
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
const styleElement = document.createElement('style');
styleElement.innerHTML = fixListStyles;
document.head.appendChild(styleElement);

export default forwardRef(RichTextEditor);
