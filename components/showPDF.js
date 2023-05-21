import React from 'react';
import { Document, Page } from 'react-pdf';
import { Typography } from '@material-ui/core';

const PDFViewer = ({ pdfUrl }) => {
    return (
      <div>
        <Typography variant="h6">PDF Viewer</Typography>
        <div style={{ width: '100%', minHeight: '500px' }}>
          <Document file={pdfUrl}>
            <Page pageNumber={1} />
          </Document>
        </div>
      </div>
    );
};
  