import React from 'react';
import { Icon, Popup } from 'semantic-ui-react';
import { findTranslation } from '../../../common/language/translations';

interface CellContentProps {
    language: "ptbr" | "en" | undefined;
    value: string | boolean | React.ReactNode;
}

const CellContent: React.FC<CellContentProps> = ({ value, language }) => {
    const isNumeric = (value: any) => !isNaN(value) && value !== null && value !== "";

    const cellContent = (
        <>
            {typeof value === "string" ? (
                <Popup
                    on="hover"
                    hoverable
                    content={<div dangerouslySetInnerHTML={{ __html: value.replace(/,/g, '<br />') }} />}
                    trigger={
                        <span>
                            {value.substring(0, 24)}
                            {value.length > 24 ? "..." : ""}
                        </span>
                    }
                />
            ) : typeof value === "boolean" ? (
                value ? (
                    <Icon name="circle" color="green" title={findTranslation("Active", language)} />
                ) : (
                    <Icon name="circle" color="red" title={findTranslation("Inactive", language)} />
                )
            ) : isNumeric(value) ? (
                // Se o valor for numérico, renderiza o valor centralizado
                <span style={{ display: 'block', textAlign: 'center' }}>{value}</span>
            ) : (
                value
            )}
        </>
    );

    return cellContent;
};

export default CellContent;