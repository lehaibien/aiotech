import { Input } from "@mantine/core";
import { RichTextEditor, RichTextEditorProps } from "@mantine/tiptap";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

type ControlledRichTextEditorProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  required?: boolean;
} & Omit<
  RichTextEditorProps,
  "name" | "onChange" | "value" | "error" | "helperText" | "editor" | "children"
>;

export const ControlledRichTextEditor = <T extends FieldValues>({
  control,
  name,
  label,
  required,
  ...props
}: ControlledRichTextEditorProps<T>) => {
  const editor = useEditor({
    extensions: extensions,
    content: control._formValues[name],
    onUpdate: ({ editor }) => {
      control._formValues[name] = editor.getHTML();
    },
  });
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const { onChange, ...restField } = field;
        return (
          <div>
            <Input.Label htmlFor={name} required={required}>
              {label}
            </Input.Label>
            <Input.Error>{error?.message}</Input.Error>
            <RichTextEditor
              editor={editor}
              onChange={onChange}
              {...restField}
              {...props}
            >
              <RichTextEditor.Toolbar sticky stickyOffset={60}>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Bold />
                  <RichTextEditor.Italic />
                  <RichTextEditor.Underline />
                  <RichTextEditor.Strikethrough />
                  <RichTextEditor.ClearFormatting />
                  <RichTextEditor.Highlight />
                  <RichTextEditor.Code />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.H1 />
                  <RichTextEditor.H2 />
                  <RichTextEditor.H3 />
                  <RichTextEditor.H4 />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Blockquote />
                  <RichTextEditor.Hr />
                  <RichTextEditor.BulletList />
                  <RichTextEditor.OrderedList />
                  <RichTextEditor.Subscript />
                  <RichTextEditor.Superscript />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Link />
                  <RichTextEditor.Unlink />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.AlignLeft />
                  <RichTextEditor.AlignCenter />
                  <RichTextEditor.AlignJustify />
                  <RichTextEditor.AlignRight />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Undo />
                  <RichTextEditor.Redo />
                </RichTextEditor.ControlsGroup>
              </RichTextEditor.Toolbar>

              <RichTextEditor.Content />
            </RichTextEditor>
          </div>
          //   <NumberInput
          //     {...restField}
          //     name={name}
          //     value={value ?? ""}
          //     onChange={handleChange}
          //     error={error?.message}
          //     {...props}
          //   />
        );
      }}
    />
  );
};

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
  Image,
];
