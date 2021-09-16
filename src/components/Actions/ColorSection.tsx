import React from 'react';
import styles from './Actions.module.scss';

type ColorSectionProps = {
  selected: string,
  setValue: ((value: string) => void),
};

const ColorSection = (props: ColorSectionProps): JSX.Element => {
  const { selected, setValue } = props;

  return (
    <div className={styles['color-selection']}>
      <button
        type="button"
        className={[selected === 'green' ? styles.selected : null, styles.green, styles['color-button']].join(' ')}
        aria-label="Color Green"
        onClick={() => setValue('green')}
      />
      <button
        type="button"
        className={[selected === 'lightgreen' ? styles.selected : null, styles.lightgreen, styles['color-button']].join(' ')}
        aria-label="Color Lightgreen"
        onClick={() => setValue('lightgreen')}
      />
      <button
        type="button"
        id="blue"
        className={[selected === 'blue' ? styles.selected : null, styles.blue, styles['color-button']].join(' ')}
        aria-label="Color Blue"
        onClick={() => setValue('blue')}
      />
      <button
        type="button"
        id="red"
        className={[selected === 'red' ? styles.selected : null, styles.red, styles['color-button']].join(' ')}
        aria-label="Color Red"
        onClick={() => setValue('red')}
      />
      <button
        type="button"
        id="orange"
        className={[selected === 'orange' ? styles.selected : null, styles.orange, styles['color-button']].join(' ')}
        aria-label="Color Orange"
        onClick={() => setValue('orange')}
      />
    </div>
  );
};

export default ColorSection;
