"use client";

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
  MenuButtonImageUpload,
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
import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

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
    Image,
  ];

  useEffect(() => {
    if (typeof document !== "undefined") {
      const styleElement = document.createElement("style");
      styleElement.innerHTML = fixListStyles;
      document.head.appendChild(styleElement);
      return () => {
        document.head.removeChild(styleElement);
      };
    }
  }, []);

  const handleImageUpload = async (files: File[]) => {
    console.log(files);
    return [];
  };

  return (
    <div className="border">
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
              <MenuSelectHeading
                className="rounded p-1"
                labels={{
                  heading1: "Tiêu đề 1",
                  heading2: "Tiêu đề 2",
                  heading3: "Tiêu đề 3",
                  heading4: "Tiêu đề 4",
                  heading5: "Tiêu đề 5",
                  heading6: "Tiêu đề 6",
                  paragraph: "Văn bản",
                }}
              />
              <MenuDivider />
              <MenuButtonBold className="rounded p-1" tooltipLabel="Chữ đậm" />
              <MenuButtonItalic
                className="rounded p-1"
                tooltipLabel="Chữ nghiêng"
              />
              <MenuButtonUnderline
                className="rounded p-1"
                tooltipLabel="Chữ gạch chân"
              />
              <MenuButtonTextColor
                className="rounded p-1"
                tooltipLabel="Chọn màu chữ"
                labels={{
                  cancelButton: "Hủy",
                  saveButton: "Chọn",
                  removeColorButton: "Xóa màu",
                  removeColorButtonTooltipTitle: "Xóa màu",
                  textFieldPlaceholder: "Ví dụ: #ff0000",
                }}
              />
              <MenuDivider className="!mx-2!h-6" />
              <MenuButtonAlignLeft
                className="rounded p-1"
                tooltipLabel="Căn lề trái"
              />
              <MenuButtonAlignCenter
                className="rounded p-1"
                tooltipLabel="Căn giữa"
              />
              <MenuButtonAlignRight
                className="rounded p-1"
                tooltipLabel="Căn lề phải"
              />
              <MenuButtonAlignJustify
                className="rounded p-1"
                tooltipLabel="Căn đều"
              />
              <MenuDivider />
              <MenuButtonSuperscript
                className="rounded p-1"
                tooltipLabel="Chỉ số trên"
              />
              <MenuButtonSubscript
                className="rounded p-1"
                tooltipLabel="Chỉ số dưới"
              />
              <MenuButtonStrikethrough
                className="rounded p-1"
                tooltipLabel="Chữ gạch ngang"
              />
              <MenuButtonBlockquote
                className="rounded p-1"
                tooltipLabel="Câu trích dẫn"
              />
              <MenuDivider />
              <MenuButtonOrderedList
                className="rounded p-1"
                tooltipLabel="Danh sách có thứ tự"
              />
              <MenuButtonBulletedList
                className="rounded p-1"
                tooltipLabel="Danh sách không thứ tự"
              />
              <MenuDivider />
              <MenuButtonImageUpload
                className="rounded p-1"
                tooltipLabel="Chèn hình ảnh"
                onUploadFiles={handleImageUpload}
              />
              <MenuButtonEditLink
                className="rounded p-1"
                tooltipLabel="Chỉnh sửa liên kết"
              />
              <MenuButtonAddTable
                className="rounded p-1"
                tooltipLabel="Thêm bảng"
              />
              <TableBubbleMenu
                className="rounded p-1"
                labels={{
                  insertRowAbove: "Chèn hàng trên",
                  insertRowBelow: "Chèn hàng dưới",
                  deleteRow: "Xóa hàng",
                  insertColumnBefore: "Chèn cột trước",
                  insertColumnAfter: "Chèn cột sau",
                  deleteColumn: "Xóa cột",
                  mergeCells: "Gộp ô",
                  splitCell: "Chia ô",
                  deleteTable: "Xóa bảng",
                  toggleHeaderCell: "Chuyển đổi ô tiêu đề",
                  toggleHeaderRow: "Chuyển đổi hàng tiêu đề",
                  toggleHeaderColumn: "Chuyển đổi cột tiêu đề",
                }}
              />
              <MenuDivider className="!mx-2!h-6" />
              <MenuButtonUndo className="rounded p-1" tooltipLabel="Hoàn tác" />
              <MenuButtonRedo className="rounded p-1" tooltipLabel="Làm lại" />
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

  .ProseMirror h1 { font-size: 2.5rem; margin: 1rem 0; line-height: 1.2; }
  .ProseMirror h2 { font-size: 2rem; margin: 0.875rem 0;  line-height: 1.25; }
  .ProseMirror h3 { font-size: 1.75rem; margin: 0.75rem 0;  line-height: 1.3; }
  .ProseMirror h4 { font-size: 1.5rem; margin: 0.625rem 0; line-height: 1.4; }
  .ProseMirror h5 { font-size: 1.25rem; margin: 0.5rem 0;  line-height: 1.5; }
  .ProseMirror h6 { font-size: 1.1rem; margin: 0.375rem 0; line-height: 1.6; }
  .ProseMirror p { margin: 0.5rem 0; line-height: 1.5; }
`;

export default forwardRef(RichTextEditor);
