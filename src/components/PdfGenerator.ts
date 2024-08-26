import { jsPDF } from 'jspdf';
import {
  Equivalence,
  Material,
  ShapedCsvRow,
} from 'src/interfaces/CsvInterface';
import { i18n } from 'src/boot/i18n';

export default function (data: ShapedCsvRow) {
  let currentHeight = 38;
  const pageSize = {
    height: 297,
    width: 210,
  };
  const doc: jsPDF = new jsPDF();

  function pdfGenerator() {
    const headerBanner = '/images/0.jpg';
    doc.setFont('Helvetica', 'normal');
    headerBannerGenerator(0, headerBanner);
    headerGenerator();
    data.materials.forEach((material) => lineGenerator(material));
    footerGenerator();
    doc.save(data.siteName);
  }

  function headerBannerGenerator(pageY: number, bannerImage: string) {
    doc.addImage(bannerImage, 'png', 0, 0, pageSize.width, 60);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor('white');
    doc.setFontSize(28);
    doc.text(data.siteName.toUpperCase(), pageSize.width / 2, pageY + 17, {
      align: 'center',
    });
    doc.text('VOS GESTES COMPTENT !', pageSize.width / 2, pageY + 29, {
      align: 'center',
    });
  }

  function headerGenerator() {
    const year = data.year || new Date().getFullYear();

    doc.setFillColor(129, 186, 49);
    doc.setFontSize(11);
    doc.setTextColor('black');
    doc.setFont('Helvetica', 'bold');
    doc.roundedRect(10, currentHeight, pageSize.width - 20, 55, 5, 5, 'F');
    doc.text(
      `Grâce à VOTRE ENGAGEMENT ET AU RESPECT des consignes de tri,
      vous avez valorisé en ${year} sur ${data.siteName} :`,
      pageSize.width / 2,
      currentHeight + 8,
      {
        align: 'center',
      }
    );

    doc.setFont('Helvetica', 'bold');
    doc.setTextColor('white');
    doc.setFontSize(10);
    doc.text('TONNES', pageSize.width / 2 - 1, currentHeight + 22, {
      align: 'right',
    });

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor('white');
    doc.setFontSize(60);
    doc.text(
      `${Math.round((data.wasteTonnage as number) * 10) / 10}`,
      pageSize.width / 2,
      currentHeight + 40,
      {
        align: 'right',
      }
    );

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor('black');
    doc.setFontSize(12);
    doc.text(
      `       DE MATÉRIAUX RECYCLABLES,
       SOIT ${data.sortingRate}% DES DÉCHETS
       QUE VOUS PRODUISEZ.`,
      pageSize.width / 2 - 4,
      currentHeight + 29,
      {
        align: 'left',
      }
    );

    doc.setFillColor(231, 243, 238);
    doc.rect(10, currentHeight + 48, pageSize.width - 20, 15, 'F');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(15);
    doc.text(
      'Dans le détail, vous avez permis la valorisation de :',
      pageSize.width / 2,
      currentHeight + 57,
      {
        align: 'center',
      }
    );
    currentHeight += 64;
  }

  function lineGenerator(line: Material) {
    doc.setFillColor(231, 243, 238);
    doc.rect(10, currentHeight, pageSize.width - 20, 25, 'F');

    doc.setFont('Helvetica', 'bold');
    doc.setTextColor('#2EB4B1');
    doc.setFontSize(36);
    doc.text(`${line.quantity}`, 79, currentHeight + 14, {
      align: 'right',
    });

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor('black');
    doc.setFontSize(13);
    doc.text(i18n.global.t(`materials.${line.name}`), 78, currentHeight + 20, {
      align: 'right',
    });

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor('black');
    doc.setFontSize(13);

    if (line.equivalences.length && line.quantity > 0) {
      doc.setFontSize(10);
      let space = 0;
      const drawPosition = 100;

      // Affiche toutes les équivalences si plus d'une
      if (line.equivalences.length > 1) {
        line.equivalences.forEach((equivalence) => {
          doc.text(
            i18n.global.t(`equivalences.${equivalence.name}`, {
              value: equivalence.quantity,
            }),
            pageSize.width / 2 - 18,
            currentHeight + 15 + space,
            {
              align: 'left',
            }
          );

          space += 5;
        });
        drawerGenerator(
          line.equivalences[0], // Utiliser la première équivalence pour les images
          drawPosition,
          currentHeight + 10.5
        );
      } else {
        // Affiche une seule équivalence si une seule existe
        drawerGenerator(
          line.equivalences[0],
          drawPosition,
          currentHeight + 10.5
        );
        doc.text(
          i18n.global.t(`equivalences.${line.equivalences[0].name}`, {
            value: line.equivalences[0].quantity,
          }),
          pageSize.width / 2 - 18,
          currentHeight + 15,
          {
            align: 'left',
          }
        );
      }
    } else if (line.equivalences.length === 0 && line.quantity > 0) {
      doc.setFontSize(10);
      doc.setTextColor('#adadad');
      doc.text(
        "Cette matière n'a pas d'équivalence",
        pageSize.width / 2 - 18,
        currentHeight + 16,
        {
          align: 'left',
        }
      );
    } else if (line.quantity === 0) {
      doc.setFontSize(10);
      doc.setTextColor('#adadad');
      doc.text(
        'Votre magasin ne valorise pas encore ce type de déchêts.',
        pageSize.width / 2 - 18,
        currentHeight + 16,
        {
          align: 'left',
        }
      );
    }
    currentHeight += 26;
  }

  function footerGenerator() {
    const bannerImage = '/images/footer.png';
    const footerBlock = '/images/blockFooter.png';
    doc.addImage(
      footerBlock,
      'png',
      10,
      pageSize.height - 39,
      pageSize.width - 20,
      20
    );
    doc.addImage(
      bannerImage,
      'png',
      13,
      pageSize.height - 12,
      pageSize.width - 25,
      7
    );
  }

  function drawerGenerator(
    equivalence: Equivalence,
    posX: number,
    posY: number
  ) {
    for (let i = 0; i < Math.round(equivalence.quantity); i++) {
      posX += 9;
      doc.addImage(
        `/images/${equivalence.name}.png`,
        'png',
        posX - 22,
        posY - 8,
        7,
        7
      );
      if (i >= 11) break;
    }
  }

  return pdfGenerator;
}
