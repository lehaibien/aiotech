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
        <MenuControlsContainer>
          <MenuSelectHeading />
          <MenuDivider />
          <MenuButtonBold />
          <MenuButtonItalic />
          <MenuButtonUnderline />
          <MenuDivider />
          <MenuButtonSuperscript />
          <MenuButtonSubscript />
          <MenuButtonStrikethrough />
          <MenuButtonBlockquote />
          <MenuDivider />
          <MenuButtonOrderedList />
          <MenuButtonBulletedList />
        </MenuControlsContainer>
      )}
      RichTextFieldProps={{
        className: `w-full min-h-[400px]`,
      }}
    />
  );
}

export default forwardRef(RichTextEditor);
