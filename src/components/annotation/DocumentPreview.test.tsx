import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import DocumentPreview from './DocumentPreview';

/* eslint-disable no-unused-vars */
// Mock react-pdf
vi.mock('react-pdf', () => {
  const ActualDocument = ({
    children,
    onLoadSuccess,
    onLoadError,
    file,
    loading,
  }: {
    children: React.ReactNode;
    onLoadSuccess: (info: { numPages: number }) => void;
    onLoadError: () => void;
    file: string;
    loading?: React.ReactNode;
  }) => {
    // 模拟加载成功
    if (file === 'error.pdf') {
      onLoadError();
      return null;
    }
    onLoadSuccess({ numPages: 5 });
    return <div data-testid="pdf-document">{children}</div>;
  };

  const ActualPage = ({
    pageNumber,
  }: {
    pageNumber: number;
    width: number;
  }) => <div data-testid="pdf-page">Page {pageNumber}</div>;

  return {
    Document: ActualDocument,
    Page: ActualPage,
    pdfjs: {
      GlobalWorkerOptions: {
        workerSrc: '',
      },
      version: '5.0.0',
    },
  };
});
/* eslint-enable no-unused-vars */

vi.mock('react-pdf/dist/Page/AnnotationLayer.css', () => ({}));
vi.mock('react-pdf/dist/Page/TextLayer.css', () => ({}));

describe('DocumentPreview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('空 file 时显示空状态', () => {
    render(<DocumentPreview file="" />);
    expect(screen.getByText('暂无文档')).toBeInTheDocument();
  });

  it('渲染文档和标题', () => {
    render(
      <DocumentPreview
        file="https://example.com/test.pdf"
        title="测试文档"
      />,
    );
    expect(screen.getByText('测试文档')).toBeInTheDocument();
    expect(screen.getByTestId('pdf-document')).toBeInTheDocument();
  });

  it('无标题时正常渲染', () => {
    render(<DocumentPreview file="https://example.com/test.pdf" />);
    expect(screen.getByTestId('pdf-document')).toBeInTheDocument();
  });

  it('文档加载失败时显示错误提示', () => {
    render(<DocumentPreview file="error.pdf" />);
    expect(screen.getByText('文档加载失败')).toBeInTheDocument();
  });

  it('显示页码导航', async () => {
    render(<DocumentPreview file="https://example.com/test.pdf" />);

    // 等待加载完成
    await act(async () => {
      // 组件内部 onLoadSuccess 会设置 numPages
    });

    expect(screen.getByText('1 / 5')).toBeInTheDocument();
    expect(screen.getByLabelText('上一页')).toBeInTheDocument();
    expect(screen.getByLabelText('下一页')).toBeInTheDocument();
  });

  it('点击下一页翻到第2页', () => {
    render(<DocumentPreview file="https://example.com/test.pdf" />);

    const nextBtn = screen.getByLabelText('下一页');
    fireEvent.click(nextBtn);

    expect(screen.getByText('Page 2')).toBeInTheDocument();
    expect(screen.getByText('2 / 5')).toBeInTheDocument();
  });

  it('第1页时上一页按钮禁用', () => {
    render(<DocumentPreview file="https://example.com/test.pdf" />);

    const prevBtn = screen.getByLabelText('上一页') as HTMLButtonElement;
    expect(prevBtn).toBeDisabled();
  });

  it('最后一页时下一页按钮禁用', async () => {
    render(<DocumentPreview file="https://example.com/test.pdf" />);

    // 翻到第5页
    const nextBtn = screen.getByLabelText('下一页');
    await act(async () => {
      fireEvent.click(nextBtn); // 2
      fireEvent.click(nextBtn); // 3
      fireEvent.click(nextBtn); // 4
      fireEvent.click(nextBtn); // 5
    });

    const nextBtnAfter = screen.getByLabelText('下一页') as HTMLButtonElement;
    expect(nextBtnAfter).toBeDisabled();
  });
});
