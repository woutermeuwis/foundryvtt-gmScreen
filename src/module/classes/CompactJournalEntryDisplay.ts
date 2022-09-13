import { log } from '../helpers';
import { TEMPLATES } from '../constants';

export class CompactJournalEntryDisplay extends JournalSheet {
  cellId: string;
  enrichedJournal: string;

  constructor(object, options) {
    super(object, options);
    this.cellId = options.cellId;
  }

  get isEditable() {
    return false;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      editable: false,
      popOut: false,
    });
  }

  /** @override */
  get template() {
    if (this._sheetMode === 'image') return ImagePopout.defaultOptions.template ?? '';
    return TEMPLATES.compactJournalEntry;
  }

  _replaceHTML(element, html) {
    $(this.cellId).find('.gm-screen-grid-cell-title').text(this.title);

    const gridCellContent = $(this.cellId).find('.gm-screen-grid-cell-content');
    gridCellContent.html(html);
    this._element = html;
  }

  _injectHTML(html) {
    $(this.cellId).find('.gm-screen-grid-cell-title').text(this.title);

    const gridCellContent = $(this.cellId).find('.gm-screen-grid-cell-content');

    log(false, 'CompactJournalEntryDisplay _injectHTML', {
      cellId: this.cellId,
      gridCellContent,
      html,
    });

    gridCellContent.append(html);
    this._element = html;
  }

  /** @override */
  get id() {
    return `gmscreen-journal-${this.object.id}`;
  }

  /** @override */
  async getData(options) {
    const journalData = await super.getData(options);
    const enrichedContent = TextEditor.enrichHTML(journalData.data["pages"].map(page=> '<h1>' + page.name + '</h1>'+ page.text.content).join('\n'), {});
    return{
      ...journalData,
      enrichedContent: enrichedContent
    };
  }
}
