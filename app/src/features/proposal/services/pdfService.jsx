/**
 * pdfService.js
 * Gera PDFs de proposta usando @react-pdf/renderer (texto nativo, sem captura de DOM).
 *
 * Vantagens sobre a versão anterior (html-to-image + jsPDF + máscaras brancas):
 * - Texto real (selecionável, leve, acessível)
 * - Quebra de página automática e confiável
 * - Sem gambiarra de "tampar" conteúdo com retângulos brancos
 * - Sem dependência de DOM oculto
 */

import { pdf } from '@react-pdf/renderer';
import ProposalDocumentPDF from '../components/ProposalDocumentPDF';
import MaterialDocumentPDF from '../components/MaterialDocumentPDF';
import ArmazemDocumentPDF from '../components/ArmazemDocumentPDF';
import logoProjingUrl from '../../../../logo.svg';

let cachedLogoPng = null;

async function getLogoPngDataUri() {
  if (cachedLogoPng) return cachedLogoPng;
  try {
    const response = await fetch(logoProjingUrl);
    if (!response.ok) throw new Error(`Failed to fetch logo: ${response.status}`);
    const svgText = await response.text();
    const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const pngDataUri = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const targetWidth = 600;
        const scale = targetWidth / img.width;
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Logo image failed to load'));
      };
      img.src = url;
    });
    cachedLogoPng = pngDataUri;
    return pngDataUri;
  } catch (err) {
    console.warn('[pdfService] Could not convert logo SVG to PNG:', err);
    return null;
  }
}

function sanitizeFilename(propNum) {
  return `Proposta_${String(propNum).replace(/[^\w-]/g, '-')}.pdf`;
}

async function shareOrDownload(blob, filename) {
  if (typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNativePlatform()) {
    const { Filesystem, Directory } = await import('@capacitor/filesystem');
    const { Share } = await import('@capacitor/share');
    const base64Data = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(blob);
    });
    const savedFile = await Filesystem.writeFile({
      path: filename,
      data: base64Data,
      directory: Directory.Cache,
    });
    await Share.share({
      title: 'Abrir Proposta',
      text: filename,
      url: savedFile.uri,
      dialogTitle: 'Abrir com...',
    });
    return;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Gera o PDF de uma proposta (geral/catálogo) e dispara download/compartilhamento.
 *
 * @param {Object} params
 * @param {string} params.propNum         - Número da proposta (ex: "2026-05-123")
 * @param {Object} params.cliente         - Dados do cliente
 * @param {Array}  params.items           - Itens da proposta
 * @param {Object} params.cond            - Condições (pagamento, validade, etc.)
 * @param {Object} [params.companySettings] - Configurações da empresa (cor, nome, etc.)
 * @returns {Promise<boolean>} true em caso de sucesso, false em caso de erro
 */
export const generateProposalPDF = async ({ propNum, cliente, items, cond, companySettings }) => {
  try {
    if (!propNum || !cliente || !Array.isArray(items)) {
      throw new Error('Dados incompletos para gerar o PDF.');
    }
    const logoSrc = await getLogoPngDataUri();
    const doc = (
      <ProposalDocumentPDF
        cliente={cliente}
        items={items}
        cond={cond || {}}
        propNum={propNum}
        companySettings={companySettings}
        logoSrc={logoSrc}
      />
    );
    const blob = await pdf(doc).toBlob();
    await shareOrDownload(blob, sanitizeFilename(propNum));
    return true;
  } catch (error) {
    console.error('[pdfService] Erro ao gerar PDF (geral):', error);
    alert('Erro ao gerar PDF: ' + error.message);
    return false;
  }
};

/**
 * Gera o PDF de uma proposta de fornecimento de materiais e dispara download/compartilhamento.
 *
 * @param {Object} params
 * @param {string} params.propNum         - Número da proposta
 * @param {Object} params.cliente         - Dados do cliente
 * @param {Array}  params.items           - Itens / materiais da proposta
 * @param {Object} params.cond            - Condições (entrega, pagamento, garantia, etc.)
 * @param {Object} [params.companySettings] - Configurações da empresa
 * @returns {Promise<boolean>} true em caso de sucesso, false em caso de erro
 */
export const generateMaterialPDF = async ({ propNum, cliente, items, cond, companySettings }) => {
  try {
    if (!propNum || !cliente || !Array.isArray(items)) {
      throw new Error('Dados incompletos para gerar o PDF.');
    }
    const logoSrc = await getLogoPngDataUri();
    const doc = (
      <MaterialDocumentPDF
        cliente={cliente}
        items={items}
        cond={cond || {}}
        propNum={propNum}
        companySettings={companySettings}
        logoSrc={logoSrc}
      />
    );
    const blob = await pdf(doc).toBlob();
    await shareOrDownload(blob, sanitizeFilename(propNum));
    return true;
  } catch (error) {
    console.error('[pdfService] Erro ao gerar PDF (material):', error);
    alert('Erro ao gerar PDF: ' + error.message);
    return false;
  }
};

/**
 * Gera o PDF de uma proposta de armazém e dispara download/compartilhamento.
 *
 * @param {Object} params
 * @param {string} params.propNum          - Número da proposta
 * @param {Object} params.data             - Todos os dados do wizard de armazém
 * @param {Object} [params.companySettings] - Configurações da empresa
 * @returns {Promise<boolean>} true em caso de sucesso, false em caso de erro
 */
export const generateArmazemPDF = async ({ propNum, data, companySettings }) => {
  try {
    if (!propNum || !data) {
      throw new Error('Dados incompletos para gerar o PDF.');
    }
    const logoSrc = await getLogoPngDataUri();
    const doc = (
      <ArmazemDocumentPDF
        data={data}
        companySettings={companySettings}
        logoSrc={logoSrc}
      />
    );
    const blob = await pdf(doc).toBlob();
    await shareOrDownload(blob, sanitizeFilename(propNum));
    return true;
  } catch (error) {
    console.error('[pdfService] Erro ao gerar PDF (armazém):', error);
    alert('Erro ao gerar PDF: ' + error.message);
    return false;
  }
};

/**
 * @deprecated Mantido apenas para compatibilidade. Use generateProposalPDF ou generateArmazemPDF.
 */
export const generatePDF = async () => {
  console.warn('[pdfService] generatePDF() está deprecated. Use generateProposalPDF() ou generateArmazemPDF().');
  return false;
};
