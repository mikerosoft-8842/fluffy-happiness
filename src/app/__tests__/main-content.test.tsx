import { test, expect, vi, afterEach, beforeEach, describe } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MainContent } from "../main-content";

// Mock the contexts
vi.mock("@/lib/contexts/file-system-context", () => ({
  FileSystemProvider: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@/lib/contexts/chat-context", () => ({
  ChatProvider: ({ children }: any) => <div>{children}</div>,
}));

// Mock the child components
vi.mock("@/components/chat/ChatInterface", () => ({
  ChatInterface: () => <div data-testid="chat-interface">Chat Interface</div>,
}));

vi.mock("@/components/editor/FileTree", () => ({
  FileTree: () => <div data-testid="file-tree">File Tree</div>,
}));

vi.mock("@/components/editor/CodeEditor", () => ({
  CodeEditor: () => <div data-testid="code-editor">Code Editor</div>,
}));

vi.mock("@/components/preview/PreviewFrame", () => ({
  PreviewFrame: () => <div data-testid="preview-frame">Preview Frame</div>,
}));

vi.mock("@/components/HeaderActions", () => ({
  HeaderActions: () => <div data-testid="header-actions">Header Actions</div>,
}));

// Mock the resizable components
vi.mock("@/components/ui/resizable", () => ({
  ResizableHandle: ({ className }: any) => (
    <div className={className} data-testid="resizable-handle" />
  ),
  ResizablePanel: ({ children, defaultSize, minSize, maxSize }: any) => (
    <div
      data-testid="resizable-panel"
      data-default-size={defaultSize}
      data-min-size={minSize}
      data-max-size={maxSize}
    >
      {children}
    </div>
  ),
  ResizablePanelGroup: ({ children, direction, className }: any) => (
    <div
      className={className}
      data-testid="resizable-panel-group"
      data-direction={direction}
    >
      {children}
    </div>
  ),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

describe("MainContent Toggle Buttons", () => {
  test("renders with preview tab active by default", () => {
    render(<MainContent />);

    // Preview should be visible
    expect(screen.getByTestId("preview-frame")).toBeDefined();

    // Code editor and file tree should not be visible
    expect(screen.queryByTestId("code-editor")).toBeNull();
    expect(screen.queryByTestId("file-tree")).toBeNull();
  });

  test("toggle buttons are rendered", () => {
    render(<MainContent />);

    // Both toggle buttons should be present
    const previewButton = screen.getByRole("tab", { name: /preview/i });
    const codeButton = screen.getByRole("tab", { name: /code/i });

    expect(previewButton).toBeDefined();
    expect(codeButton).toBeDefined();
  });

  test("clicking code button switches to code view", async () => {
    const user = userEvent.setup();
    render(<MainContent />);

    // Initially preview should be visible
    expect(screen.getByTestId("preview-frame")).toBeDefined();

    // Click the code button
    const codeButton = screen.getByRole("tab", { name: /code/i });
    await user.click(codeButton);

    // Code editor and file tree should now be visible
    expect(screen.getByTestId("code-editor")).toBeDefined();
    expect(screen.getByTestId("file-tree")).toBeDefined();

    // Preview should not be visible
    expect(screen.queryByTestId("preview-frame")).toBeNull();
  });

  test("clicking preview button switches back to preview view", async () => {
    const user = userEvent.setup();
    render(<MainContent />);

    // Click code button first
    const codeButton = screen.getByRole("tab", { name: /code/i });
    await user.click(codeButton);

    // Verify we're in code view
    expect(screen.getByTestId("code-editor")).toBeDefined();

    // Click preview button
    const previewButton = screen.getByRole("tab", { name: /preview/i });
    await user.click(previewButton);

    // Preview should be visible again
    expect(screen.getByTestId("preview-frame")).toBeDefined();

    // Code editor and file tree should not be visible
    expect(screen.queryByTestId("code-editor")).toBeNull();
    expect(screen.queryByTestId("file-tree")).toBeNull();
  });

  test("toggle buttons can be clicked multiple times", async () => {
    const user = userEvent.setup();
    render(<MainContent />);

    const previewButton = screen.getByRole("tab", { name: /preview/i });
    const codeButton = screen.getByRole("tab", { name: /code/i });

    // Click back and forth multiple times
    await user.click(codeButton);
    expect(screen.getByTestId("code-editor")).toBeDefined();

    await user.click(previewButton);
    expect(screen.getByTestId("preview-frame")).toBeDefined();

    await user.click(codeButton);
    expect(screen.getByTestId("code-editor")).toBeDefined();

    await user.click(previewButton);
    expect(screen.getByTestId("preview-frame")).toBeDefined();

    await user.click(codeButton);
    expect(screen.getByTestId("code-editor")).toBeDefined();
  });

  test("correct tab has active state", async () => {
    const user = userEvent.setup();
    render(<MainContent />);

    const previewButton = screen.getByRole("tab", { name: /preview/i });
    const codeButton = screen.getByRole("tab", { name: /code/i });

    // Initially preview should be active
    expect(previewButton).toHaveAttribute("data-state", "active");
    expect(codeButton).toHaveAttribute("data-state", "inactive");

    // Click code button
    await user.click(codeButton);

    // Code should now be active
    expect(codeButton).toHaveAttribute("data-state", "active");
    expect(previewButton).toHaveAttribute("data-state", "inactive");

    // Click preview button
    await user.click(previewButton);

    // Preview should be active again
    expect(previewButton).toHaveAttribute("data-state", "active");
    expect(codeButton).toHaveAttribute("data-state", "inactive");
  });
});
